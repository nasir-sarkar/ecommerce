// POST /api/upload  (single)
export const uploadSingle = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' })
  }
  // Return the public URL path
  const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
  res.json({ url })
}


// POST /api/upload/multiple  (up to 3)
export const uploadMultiple = (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded' })
  }
  const urls = req.files.map(
    file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
  )
  res.json({ urls })
}