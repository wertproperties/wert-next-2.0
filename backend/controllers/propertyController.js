const Property = require('../models/Property');

exports.getAllProperties = async (req, res) => {
  try {
    const filter = req.query.featured === 'true' ? { featured: true } : {};
    const properties = await Property.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: properties.length, data: properties });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });
    res.json({ success: true, data: property });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createProperty = async (req, res) => {
  try {
    const property = await Property.create(req.body);
    res.status(201).json({ success: true, data: property });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.seedProperties = async (req, res) => {
  try {
    await Property.deleteMany({});
    const seeds = [
    ];
    const properties = await Property.insertMany(seeds);
    res.json({ success: true, message: 'Seeded properties', count: properties.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
