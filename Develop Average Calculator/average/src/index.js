const express = require('express');
const axios = require('axios');

const app = express();
const port = 9876;

let windowPrevious = []
let windowCurrent = []

// Your Bearer token
// const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzE4ODY1MjI4LCJpYXQiOjE3MTg4NjQ5MjgsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImRjOGI5MmU5LWUzYzQtNGU0NS04M2ZiLTYzMTdhNzkzNjBhZiIsInN1YiI6IjIxMTAwNDAwNDNlY2VAZ21haWwuY29tIn0sImNvbXBhbnlOYW1lIjoiQWZmb3JkbWVkIiwiY2xpZW50SUQiOiJkYzhiOTJlOS1lM2M0LTRlNDUtODNmYi02MzE3YTc5MzYwYWYiLCJjbGllbnRTZWNyZXQiOiJLSXlKTHpqbURGRldPeVJTIiwib3duZXJOYW1lIjoiUmlzaGlrYSIsIm93bmVyRW1haWwiOiIyMTEwMDQwMDQzZWNlQGdtYWlsLmNvbSIsInJvbGxObyI6IjIxMTAwNDAwNDMifQ.k24f17pKjXdZ7tZnNtdPu6DFlw1GdA7gBjk22-LwhSY'
// const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzE4ODY2MDYzLCJpYXQiOjE3MTg4NjU3NjMsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImRjOGI5MmU5LWUzYzQtNGU0NS04M2ZiLTYzMTdhNzkzNjBhZiIsInN1YiI6IjIxMTAwNDAwNDNlY2VAZ21haWwuY29tIn0sImNvbXBhbnlOYW1lIjoiQWZmb3JkbWVkIiwiY2xpZW50SUQiOiJkYzhiOTJlOS1lM2M0LTRlNDUtODNmYi02MzE3YTc5MzYwYWYiLCJjbGllbnRTZWNyZXQiOiJLSXlKTHpqbURGRldPeVJTIiwib3duZXJOYW1lIjoiUmlzaGlrYSIsIm93bmVyRW1haWwiOiIyMTEwMDQwMDQzZWNlQGdtYWlsLmNvbSIsInJvbGxObyI6IjIxMTAwNDAwNDMifQ.M70OPSQ-JEkFEdO5WTOuFlkI4Bbu9r-EAsbn8pxniiY'
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzE4ODY2NDAxLCJpYXQiOjE3MTg4NjYxMDEsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImRjOGI5MmU5LWUzYzQtNGU0NS04M2ZiLTYzMTdhNzkzNjBhZiIsInN1YiI6IjIxMTAwNDAwNDNlY2VAZ21haWwuY29tIn0sImNvbXBhbnlOYW1lIjoiQWZmb3JkbWVkIiwiY2xpZW50SUQiOiJkYzhiOTJlOS1lM2M0LTRlNDUtODNmYi02MzE3YTc5MzYwYWYiLCJjbGllbnRTZWNyZXQiOiJLSXlKTHpqbURGRldPeVJTIiwib3duZXJOYW1lIjoiUmlzaGlrYSIsIm93bmVyRW1haWwiOiIyMTEwMDQwMDQzZWNlQGdtYWlsLmNvbSIsInJvbGxObyI6IjIxMTAwNDAwNDMifQ.BEuLq007F1rtQQCbBEe7aUE-9DnDUJ5Mhs6KarTicig'
// Array to store the numbers
let numbers = [];

// Configuring the request
const config = {
  headers: { 
    'Authorization': `Bearer ${token}`
  },
  timeout: 50000 // Set timeout to 50 seconds
};

// Create a cancel token
const CancelToken = axios.CancelToken;
const source = CancelToken.source();


function calculateAverage(numbers) {
    // Check if the array is empty to avoid division by zero
    if (numbers.length === 0) return 0;

    // Compute the sum of the array elements using reduce
    const sum = numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    // Calculate the average by dividing the sum by the number of elements
    const average = sum / numbers.length;

    return average;
}


// Function to make the GET request
const makeRequest = ({value}) => {
    let toFetch = ''
    console.log('valueee', value)
    if (value == 'p') {
        toFetch = 'primes'
    }
    if (value == 'f') {
        toFetch = 'fibo'
    }
    if (value == 'e') {
        toFetch = 'even'
    }
    if (value == 'r') {
        toFetch = 'rand'
    }
    console.log('toFetch', toFetch)
    console.log(`http://20.244.56.144/test/${toFetch}`)
  axios.get(`http://20.244.56.144/test/${toFetch}`, {
    ...config,
    cancelToken: source.token
  })
  .then(response => {
    windowPrevious = numbers
    numbers = response.data.numbers;
    windowCurrent = numbers

    console.log('Numbers:', numbers);
  })
  .catch(error => {
    if (axios.isCancel(error)) {
      console.log('Request canceled:', error.message);
    } else {
      console.error('Error:', error);
    }
  });
};

// Endpoint to trigger the GET request
app.get('/numbers/:type', (req, res) => {
  const { type } = req.params;
  console.log(type)
  // Cancel the request after 50 seconds
  setTimeout(() => {
    source.cancel('Request timed out after 50 seconds.');
  }, 50000);

  // Make the request
  makeRequest({value:type});
  res.json(
    { 
    "windowCurrent": windowCurrent,
    "windowPrevious": windowPrevious,
    "numbers": numbers,
    "avg": calculateAverage(numbers)
 });
  // Send response back to client
});

// // Endpoint to get the stored numbers
// app.get('/numbers', (req, res) => {
  
// });

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
