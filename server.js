const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(express.json());

const posts = [
  {
    name: "CBIT",
    title: "Welcome to CBIT"
  },
  {
    name: "MGIT",
    title: "Welcome to MGIT"
  }
];

// Middleware to authenticate JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401); // No token provided

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Invalid token
    }
    req.user = user;
    next();
  });
};

// Login route to generate JWT
app.post('/login', (req, res) => {
  const username = req.body.username;
  const user = { name: username };

  // Sign the token with an expiration time
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: '1h' });
  
  res.json({ accessToken: accessToken }); // Corrected key name
});

// Protect the posts route with the authenticateToken middleware
app.get('/posts', authenticateToken, (req, res) => {
  console.log(req.user.name); // Logging the user name
  res.json(posts.filter(post => post.name === req.user.name));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
