const mongoose = require('mongoose');

const contactSchema = mongoose.Schema({
  user_id:{
    type:mongoose.Schema.Types.ObjectId,
    reqired:true,
    ref:"User"
  },
  name: {
    type: String,
    required: [true, "Plase add the contact name"],
  },
  email: {
    type: String,
    required: [true, "Plase add the email address"],
  },
  phoneno: {
    type: String,
    required: [true, "Plase add the phone number"],
  },
},{
    timestamp : true
});

module.exports = mongoose.model("Contact",contactSchema)