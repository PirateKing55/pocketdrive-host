import { loginUser, signUpUser } from "../model/db.js";

export const test = (req, res) => {
  res.send("Hello");
};

export const errorTest = (req, res) => {
  throw new Error("Error test");
};

export const signUpHandler = async (req, res, next) => {
  try {
    const { name, phoneNo, password } = req.body;
    const user = await signUpUser(name, phoneNo, password);
    res.json({ token: user._id, name: user.name });
  } catch (error) {
    if (error.message) res.status(500).json({ message: error.message });
    else res.status(500).json({ message: "Error Signing Up" });
  }
};

export const loginHandler = async (req, res, next) => {
  try {
    const { phoneNo, password } = req.body;
    console.log(phoneNo, password);
    const user = await loginUser(phoneNo, password);
    res.json({ token: user._id, name: user.name });
  } catch (error) {
    if (error.message) res.status(500).json({ message: error.message });
    else res.status(500).json({ message: "Error Logging Up" });
  }
};
