const users = require('../data/users.json');

module.exports = (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  
  if (req.method === 'POST') {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password_hash === password);
    
    if (user) {
      res.status(200).json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status
        },
        token: `mock_token_${user.id}_${Date.now()}`
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};