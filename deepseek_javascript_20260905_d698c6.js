const users = require('../data/users.json');
const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  
  switch(req.method) {
    case 'GET':
      if (req.query.id) {
        const user = users.find(u => u.id === parseInt(req.query.id));
        res.status(200).json(user || { message: 'User not found' });
      } else {
        res.status(200).json(users);
      }
      break;
      
    case 'POST':
      const newUser = {
        id: users.length + 1,
        ...req.body,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      users.push(newUser);
      fs.writeFileSync(path.join(__dirname, '../data/users.json'), JSON.stringify(users, null, 2));
      res.status(201).json(newUser);
      break;
      
    case 'PUT':
      const userId = parseInt(req.query.id);
      const index = users.findIndex(u => u.id === userId);
      if (index !== -1) {
        users[index] = { ...users[index], ...req.body, updated_at: new Date().toISOString() };
        fs.writeFileSync(path.join(__dirname, '../data/users.json'), JSON.stringify(users, null, 2));
        res.status(200).json(users[index]);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
      break;
      
    case 'DELETE':
      const deleteId = parseInt(req.query.id);
      const filteredUsers = users.filter(u => u.id !== deleteId);
      fs.writeFileSync(path.join(__dirname, '../data/users.json'), JSON.stringify(filteredUsers, null, 2));
      res.status(200).json({ message: 'User deleted' });
      break;
      
    default:
      res.status(405).json({ message: 'Method not allowed' });
  }
};