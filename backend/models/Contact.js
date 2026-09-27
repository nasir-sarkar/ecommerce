import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema({
  contactInfo: {
    address: {
      type: String,
      required: true,
      default: "13th Street. 47 W 13th St, New York, NY 10011, USA"
    },
    phone: {
      type: String,
      required: true,
      default: "124-251-524"
    },
    email: {
      type: String,
      required: true,
      default: "activeecommerce@gmail.com"
    }
  },
  description: {
    type: String,
    required: true,
    default: "This is a demo message for Active eCommerce CMS, by Active IT Zone Limited, to demonstrate the Contact Us feature."
  },
  contactus: [{
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      default: ''
    },
    query: {
      type: String,
      required: true
    },
    submittedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

export default mongoose.model('Contact', ContactSchema);