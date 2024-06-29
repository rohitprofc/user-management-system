// routes/user.js

const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Path to users.json file
const usersFilePath = path.join(__dirname, '../data/users.json');

// Helper function to read users from the JSON file
const readUsersFromFile = () => {
  const data = fs.readFileSync(usersFilePath);
  return JSON.parse(data);
};

// Helper function to write users to the JSON file
const writeUsersToFile = (users) => {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

// Retrieve all users
router.get('/', (req, res) => {
  const users = readUsersFromFile();
  res.json(users);
});

// Retrieve a user by ID
router.get('/:id', (req, res) => {
  const users = readUsersFromFile();
  const user = users.find((u) => u.id === parseInt(req.params.id, 10));
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Create a new user
router.post('/', (req, res) => {
  const users = readUsersFromFile();
  const newUser = req.body;
  newUser.id = users.length ? users[users.length - 1].id + 1 : 1;
  users.push(newUser);
  writeUsersToFile(users);
  res.status(201).json(newUser);
});

// Update a user by ID with validation
router.put('/:id', (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
  
    const users = readUsersFromFile();
    const userIndex = users.findIndex((u) => u.id === parseInt(req.params.id, 10));
    if (userIndex !== -1) {
      const updatedUser = { ...users[userIndex], name, email };
      users[userIndex] = updatedUser;
      writeUsersToFile(users);
      res.json(updatedUser);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  });

// Delete a user by ID
router.delete('/:id', (req, res) => {
  let users = readUsersFromFile();
  const userIndex = users.findIndex((u) => u.id === parseInt(req.params.id, 10));
  if (userIndex !== -1) {
    users = users.filter((u) => u.id !== parseInt(req.params.id, 10));
    writeUsersToFile(users);
    res.json({ message: 'User deleted' });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

module.exports = router;
