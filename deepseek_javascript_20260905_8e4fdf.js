const services = require('../data/services.json');
const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  
  switch(req.method) {
    case 'GET':
      if (req.query.id) {
        const service = services.find(s => s.id === parseInt(req.query.id));
        res.status(200).json(service || { message: 'Service not found' });
      } else {
        res.status(200).json(services);
      }
      break;
      
    case 'POST':
      const newService = {
        id: services.length + 1,
        ...req.body,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      services.push(newService);
      fs.writeFileSync(path.join(__dirname, '../data/services.json'), JSON.stringify(services, null, 2));
      res.status(201).json(newService);
      break;
      
    case 'PUT':
      const serviceId = parseInt(req.query.id);
      const index = services.findIndex(s => s.id === serviceId);
      if (index !== -1) {
        services[index] = { ...services[index], ...req.body, updated_at: new Date().toISOString() };
        fs.writeFileSync(path.join(__dirname, '../data/services.json'), JSON.stringify(services, null, 2));
        res.status(200).json(services[index]);
      } else {
        res.status(404).json({ message: 'Service not found' });
      }
      break;
      
    case 'DELETE':
      const deleteId = parseInt(req.query.id);
      const filteredServices = services.filter(s => s.id !== deleteId);
      fs.writeFileSync(path.join(__dirname, '../data/services.json'), JSON.stringify(filteredServices, null, 2));
      res.status(200).json({ message: 'Service deleted' });
      break;
      
    default:
      res.status(405).json({ message: 'Method not allowed' });
  }
};