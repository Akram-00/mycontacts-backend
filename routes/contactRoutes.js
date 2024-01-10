const express = require("express");
const router = express.Router();
const {
  getContacts,
  updateContact,
  deleteContact,
  createContact,
  getContact
} = require("../controllers/contactController");
const validateToken = require("../middleware/validateTokenHandler");

router.use(validateToken)
// get
router.route("/").get(getContacts).post(createContact);
//get,put,delete contact
router.route("/:id").get(getContact).put(updateContact).delete(deleteContact);



module.exports = router;
