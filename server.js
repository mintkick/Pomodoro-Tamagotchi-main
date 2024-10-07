const https = require('https');
const express = require('express');

const app = express();
const hostname = '127.0.0.1';
const port = 3000;
const ACCESS_TOKEN = '10706~hTC87yXh68R4JYV9r2exTURtfxnT38RVUTKMMzcBZ3QyrfKEUCBua7t2fPXwumJQ';
const TOP_URL = 'https://byui.instructure.com';

app.get('/api/courses', (req, res) => {
  const url = `${TOP_URL}/api/v1/courses/?enrollment_state=active`;
  const options = {
    headers: {
      'Authorization': `Bearer ${ACCESS_TOKEN}`
    }
  };
  https.get(url, options, (response) => {
    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      res.json(JSON.parse(data));
    });
  }).on('error', (error) => {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  });
});




app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});