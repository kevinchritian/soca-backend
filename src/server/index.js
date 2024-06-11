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
      const port = process.env.APP_PORT || 3000;
      app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
      });
    } catch (error) {
      console.error('Failed to start server:', error);
    }
  })();