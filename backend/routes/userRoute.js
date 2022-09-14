import express from "express";
import User from "../models/userModel";
import { getToken, isAuth } from "../util";
import { loginValidation, registerValidation } from "../validate";
import bcrypt from "bcryptjs";
const router = express.Router();

router.put("/:id", isAuth, async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  if (user) {
    user.name = req.body.name || user.name;
    // user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.password = hashedPassword || user.password;
    const updatedUser = await user.save();
    res.send({
      _id: updatedUser.id,
      name: updatedUser.name,
      // username : updatedUser.username,
      email: updatedUser.email,
      token: getToken(updatedUser),
    });
  } else {
    res.status(404).send({ msg: "User Not Found" });
  }
});

router.post("/signin", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });
  const signinUser = await User.findOne({ email: req.body.email });
  if (!signinUser)
    return res.status(401).send({ message: "email does not exist" });
  const validPass = await bcrypt.compare(
    req.body.password,
    signinUser.password
  );
  if (!validPass) return res.status(401).send({ message: "invalid password" });

  if (signinUser && validPass) {
    res.send({
      _id: signinUser.id,
      name: signinUser.name,
      email: signinUser.email,
      // username : signinUser.username,
      
      token: getToken(signinUser),
    });
  } else {
    res.status(401).send({ msg: "Invalid Email or Password." });
  }
});

router.post("/register", async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("email exist");
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  const user = new User({
    name: req.body.name,
    // username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
  });
  const newUser = await user.save();
  if (newUser) {
    res.send({
      _id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      
      token: getToken(newUser),
    });
  } else {
    res.status(401).send({ msg: "Invalid User Data." });
  }
});



export default router;
