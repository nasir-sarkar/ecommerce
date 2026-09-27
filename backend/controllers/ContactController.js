import Contact from "../models/Contact.js";

// GET /api/contact/info
export const getContactInfo = async (req, res) => {
  try {
    let contact = await Contact.findOne();

    if (!contact) {
      contact = await Contact.create({
        contactInfo: {
          address:
            "13th Street. 47 W 13th St, New York, NY 10011, USA",
          phone: "124-251-524",
          email: "activeecommerce@gmail.com",
        },
        description:
          "This is a demo message for Active eCommerce CMS.",
        contactus: [],
      });
    }

    res.json({
      success: true,
      data: contact,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};


// PUT /api/contact/info
export const updateContactInfo = async (req, res) => {
  try {
    const { address, phone, email, description } = req.body;

    let contact = await Contact.findOne();

    if (!contact) {
      contact = new Contact();
    }

    contact.contactInfo = { address, phone, email };
    contact.description = description;

    await contact.save();

    res.json({ success: true, message: "Updated successfully" });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};


// POST /api/contact/submit
export const submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, query } = req.body;

    if (!name || !email || !query) {
      return res.status(400).json({
        success: false,
        message: "Name, email, query required",
      });
    }

    let contact = await Contact.findOne();

    if (!contact) {
      contact = await Contact.create({
        contactInfo: {},
        description: "",
        contactus: [],
      });
    }

    contact.contactus.push({
      name,
      email,
      phone: phone || "",
      query,
      submittedAt: new Date(),
    });

    await contact.save();

    res.json({ success: true, message: "Submitted" });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};


// GET /api/contact/submissions
export const getContactSubmissions = async (req, res) => {
  try {
    const contact = await Contact.findOne();

    res.json({
      success: true,
      data: contact?.contactus || [],
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};


// DELETE /api/contact/submission/:id
export const deleteSubmission = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findOne();

    contact.contactus = contact.contactus.filter(
      (item) => item._id.toString() !== id
    );

    await contact.save();

    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};


// DELETE /api/contact/submissions
export const deleteAllSubmissions = async (req, res) => {
  try {
    const contact = await Contact.findOne();

    contact.contactus = [];

    await contact.save();

    res.json({ success: true, message: "All deleted" });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};