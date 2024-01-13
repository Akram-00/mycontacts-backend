// Imporing ( express, errorHandler, connectDb, env)
const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const env = require("dotenv").config();

// connecting the Mongo data base
connectDb();

// creating a server
const app = express();

// Listening at port ( secret ) or 5000
const port = process.env.PORT || 5000;

//Mounts middleware for  Json data
app.use(express.json());

// Mounts middleware for  routes of( contacts and users )
app.use("/api/contacts", require('./routes/contactRoutes'));
app.use("/api/users", require('./routes/userRoutes'));

// Mounts middleware for handling the errors
app.use(errorHandler)

// This server listens at the port and prints the msg
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
