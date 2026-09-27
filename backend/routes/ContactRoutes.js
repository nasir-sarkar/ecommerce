import express from "express";
import {
  getContactInfo,
  updateContactInfo,
  submitContactForm,
  getContactSubmissions,
  deleteSubmission,
  deleteAllSubmissions,
} from "../controllers/contactController.js";

const router = express.Router();


// CONTACT INFO (Admin + Public)
router.get("/info", getContactInfo);
router.put("/info", updateContactInfo);


// CONTACT FORM (Public)
router.post("/submit", submitContactForm);


// CONTACT SUBMISSIONS (Admin)
router.get("/submissions", getContactSubmissions);
router.delete("/submissions", deleteAllSubmissions);
router.delete("/submission/:id", deleteSubmission);


export default router;