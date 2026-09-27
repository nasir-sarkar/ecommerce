import Footer from '../models/Footer.js';

const getDoc = async () => {
  let doc = await Footer.findOne();
  if (!doc) doc = await Footer.create({});
  return doc;
};


// GET /api/footer
export const getFooter = async (req, res) => {
  try {
    const doc = await getDoc();
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// PUT /api/footer  — full or partial update
export const updateFooter = async (req, res) => {
  try {
    const allowed = [
      'descriptionTitle', 'descriptionText',
      'logoUrl', 'googlePlayUrl', 'appStoreUrl',
      'socialLinks',
      'quickLinks',
      'contact',
      'myAccountLinks',
      'sellerLinks',
      'deliveryLinks',
      'copyrightText',
    ];
    const doc = await getDoc();
    allowed.forEach(key => {
      if (req.body[key] !== undefined) doc[key] = req.body[key];
    });
    const saved = await doc.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};