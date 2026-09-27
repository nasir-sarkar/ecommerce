import Policy from '../models/Policy.js';

const getOrCreate = async (type) => {
  let doc = await Policy.findOne({ type });
  if (!doc) doc = await Policy.create({ type, sections: [] });
  return doc;
};


// GET /api/policy/:type
export const getPolicy = async (req, res) => {
  try {
    const doc = await getOrCreate(req.params.type);
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// PUT /api/policy/:type
export const updatePolicy = async (req, res) => {
  try {
    const doc = await getOrCreate(req.params.type);
    if (req.body.sections !== undefined) doc.sections = req.body.sections;
    doc.updatedAt = new Date();
    const saved = await doc.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};