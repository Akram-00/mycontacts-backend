const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

// for encryption and decryption of passwords
const bcrypt = require("bcrypt");

// for Authentication and Authorization purposes
const jwt = require("jsonwebtoken");

//@description Register a user
//@route GET/api/users/register
//@access public

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Validation Failed");
  }
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("User Already Registered");
  }
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Hashed Password : ", hashedPassword);
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });
  console.log("user created successfully");
  if (user) {
    res.status(201).json({ _id: user.id, email: user.email });
  } else {
    res.status(400);
    throw new Error("User data is not valid");
  }
  res.json({ message: "Register the user" });
});

//@description Login a user
//@route GET/api/users/login
//@access public

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory ");
  }
  const user = await User.findOne({ email });
  // compare password with hash password
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    res.status(200).json({ accessToken });
  } else {
    res.status(401);
    throw new Error("Email or Password is not valid");
  }
  res.json({ message: "Login the user" });
});

//@description Current user Information
//@route GET/api/users/current
//@access private

const currentUser = asyncHandler(async (req, res) => {
  res.json(req.user);
});

//@description Current user updation
//@route UPDATE/api/users/current
//@access private

const updateUser = asyncHandler(async (req, res) => {
  const { username, email, oldPassword, newPassword } = req.body;

  if (username && email && oldPassword && newPassword) {
    const user = await User.findById(req.user.id); // Change 'findBy' to 'findById'

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const isValidPassword = await bcrypt.compare(oldPassword, user.password);

    if (!isValidPassword) {
      res.status(400);
      throw new Error("Old password is wrong");
    }

    user.username = username;
    user.email = email;
    const hashedPassword = await bcrypt.hash(newPassword, 10); // Change 'password' to 'newPassword'
    user.password = hashedPassword;

    const updatedUser = await user.save();
    res.json(req.user);
  } else {
    res.status(400);
    throw new Error("Invalid input data");
  }
  // res.json({message:"Update user profile"})
});

//@description Current user Deletion
//@route DELETE/api/users/current
//@access private

const deleteUser = asyncHandler(async (req, res) => {

  const userId = req.user.id;

  // Use Mongoose's deleteOne to find and delete the user by ID
  const result = await User.deleteOne({ _id: userId });

  if (result.deletedCount === 0) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  res.status(200).json({ message: 'User deleted successfully' });
});

module.exports = {
  registerUser,
  loginUser,
  currentUser,
  deleteUser,
  updateUser,
};
