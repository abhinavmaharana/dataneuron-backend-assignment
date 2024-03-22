const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

// MongoDB connection
mongoose.connect('mongodb+srv://admin:admin@cluster0.gbtfyzf.mongodb.net/', {
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// MongoDB Schema
const componentSchema = new mongoose.Schema({
  name: String,
  data: String,
});
const Component = mongoose.model('Component', componentSchema);

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Add Data API
app.post('/api/data/add', async (req, res) => {
    const { name, data } = req.body;
  
    if (!name || !data) {
      return res.status(400).json({ message: 'Both name and data are required.' });
    }
  
    try {
      const existingComponent = await Component.findOne({ name });
  
      if (existingComponent) {
        return res.status(400).json({ message: 'Component already exists. Use update API instead.' });
      }
  
      await Component.create({ name, data });
      res.status(200).json({ message: 'Data added successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error.' });
    }
});
  
// Update Data API
app.put('/api/data/update', async (req, res) => {
    const { name, data } = req.body;
  
    if (!name || !data) {
      return res.status(400).json({ message: 'Both name and data are required.' });
    }
  
    try {
      const existingComponent = await Component.findOneAndUpdate({ name }, { data });
  
      if (!existingComponent) {
        return res.status(404).json({ message: 'Component not found.' });
      }
  
      res.status(200).json({ message: 'Data updated successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error.' });
    }
});
  
// Count API
app.get('/api/count', async (req, res) => {
    try {
      const componentCount = await Component.countDocuments();
      res.status(200).json({ componentCount });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error.' });
    }
});
  
// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));