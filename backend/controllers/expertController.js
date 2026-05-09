const Expert = require('../models/Expert');

exports.getExperts = async (req, res) => {
  try {
    const { search, category, page = 1, limit = 10 } = req.query;
    
    const query = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (category) {
      query.category = category;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const experts = await Expert.find(query).skip(skip).limit(parseInt(limit));
    const total = await Expert.countDocuments(query);

    res.json({
      experts,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

exports.getExpertById = async (req, res) => {
  try {
    const expert = await Expert.findById(req.params.id);
    if (!expert) return res.status(404).json({ error: 'Expert not found' });
    res.json(expert);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};
