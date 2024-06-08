const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const breweryRoutes = require('./routes/breweryRoutes');
const path = require('path');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/breweries', breweryRoutes);

// Fallback for serving index.html on undefined routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Server setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
