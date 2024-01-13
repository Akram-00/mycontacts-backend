const express = require("express");

// importing the routers
const router = express.Router();

// importing the controllers
const {
  getContacts,
  updateContact,
  deleteContact,
  createContact,
  getContact
} = require("../controllers/contactController");

// importing the Middleware
const validateToken = require("../middleware/validateTokenHandler");

// Mounting the middleware
router.use(validateToken)
// get
router.route("/").get(getContacts).post(createContact);
//get,put,delete contact
router.route("/:id").get(getContact).put(updateContact).delete(deleteContact);



module.exports = router;
