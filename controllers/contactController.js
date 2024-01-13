// importing the async handler
const asyncHandler = require("express-async-handler");

// importing the contact - model
const Contact = require("../models/contactModel");


//@description Get all contacts
//@route GET/api/contacts
//@access private

const getContacts = asyncHandler(async (req, res) => {
  // find the contacts from the database
  const contacts = await Contact.find({ user_id: req.user.id });
  // respond with the status of 200 and contacts.json(many)
  res.status(200).json(contacts);
});

//@description Get Contact
//@route GET/api/contacts
//@access private

const getContact = asyncHandler(async (req, res) => {
  // find the contact by its Id
  const contact = await Contact.findById(req.params.id);
  // No contact = "Not Found"
  if (!contact) {
    res.status(404);
    throw new Error("Contact not Found");
  }
  // Incorrect User Id = "UnAuthorized Access"
  if (contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User don't have permission to view other user contacts");
  }
  // respond with the status of 200 and contact.json(single)
  res.status(200).json(contact);
});

//@description Create New contacts
//@route POST/api/contacts
//@access private

const createContact = asyncHandler(async (req, res) => {
  console.log("Requested body", req.body);
  // destructuring the req.body
  const { name, email, phoneno } = req.body;
  // No Name or No email or No PhoneNumber = ( Not enough data to create a contact)
  if (!name || !email || !phoneno) {
    res.status(400);
    throw Error("All fields are mandatory");
  }
  // using Contact (Model) create the contact 
  const contact = await Contact.create({
    name,
    email,
    phoneno,
    user_id: req.user.id,
  });
  res.status(201).json(contact);
});

//@description Update Contact
//@route PUT/api/contacts
//@access private

const updateContact = asyncHandler(async (req, res) => {
  // find the contact by Id
  const contact = await Contact.findById(req.params.id);
  // No contact = "Not Found"
  if (!contact) {
    res.status(404);
    throw new Error("Contact not Found");
  }
  // UnAuthorized Accessing 
  if (contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User don't have permission to update other user contacts");
  }

  // updating the contact using Contact(Model) using Find_By_Id_And_Update(id,data,boolean object)
  const updatedContact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  
  res.status(200).json(updatedContact);
});

//@description Delete contacts
//@route DELETE/api/contacts
//@access private

const deleteContact = asyncHandler(async (req, res) => {
  // finding the contact by id
  const contact = await Contact.findById(req.params.id);
  // Contacts not Found
  if (!contact) {
    res.status(404);
    throw new Error("Contact not Found");
  }
  // Unauthorized Accessing
  if (contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User don't have permission to delete other user contacts");
  }
  // Deleing the contact
  await Contact.deleteOne();
  res.status(200).json(contact);
});

module.exports = {
  getContacts,
  getContact,
  updateContact,
  deleteContact,
  createContact,
};
