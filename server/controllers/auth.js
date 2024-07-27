import bcrypt from "bcrypt"; // for password encryption
import jwt from "jsonwebtoken"; // for authentication
import User from "../models/User.js";

export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      friends,
      location,
      occupation
    } = req.body;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath: req.file.path, // Ensure this matches the field in the multer middleware
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000)
    });

    const savedUser = await newUser.save(); // Save the user to the database
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


//Logging In
export const login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email: email });
      if (!user) return res.status(400).json({ msg: "User does not exist" });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.status(200).json({ token, user: { ...user._doc, password: undefined } });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  