const express = require("express");
const {
  registerUser,
  loginUser,
  currentUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const validateToken = require("../middleware/validateTokenHandler");
const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router
  .route("/current")
  .all(validateToken)
  .get(currentUser)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;
