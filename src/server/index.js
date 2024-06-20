require('dotenv').config();
const express = require('express');
const routes = require('../routes');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(routes);

(async () => {
    try {  
      const port = process.env.PORT || 8000;
      app.listen(port, '0.0.0.0', () => {
        console.log(`Server running on ${port}`);
      });
    } catch (error) {
      console.error('Failed to start server:', error);
    }
  })();