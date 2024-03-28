import { Schema, connect, model } from "mongoose";
import { createHash } from "node:crypto";
import { dbUri } from "../config.js";

const fileSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  isFavourite: {
    type: Boolean,
    default: false,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
});

const collectionSchema = new Schema({
  collectionName: {
    type: String,
    required: true,
  },
  files: {
    type: [fileSchema],
    required: true,
    default: [],
  },
});

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  phoneNo: {
    type: String,
    required: true,
    unique: true,
  },
  session: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  files: {
    type: [fileSchema],
    default: [],
  },
  collections: {
    type: [collectionSchema],
    default: getDefaultCollections(),
  },
});

function getDefaultCollections() {
  return [
    { collectionName: "Favourites", files: [] },
    // { collectionName: "Bin", files: [] },
  ];
}

connect(dbUri)
  .then(console.log("Connected to DATABASE"))
  .catch((err) => console.error(err));

const User = model("User", userSchema);

export const signUpUser = async (name, phoneNo, password) => {
  try {
    const userExists = await User.findOne({ phoneNo });
    if (userExists) throw new Error("User already exists, please login");
    const passHash = createHash("sha256").update(password).digest("hex");
    const user = new User({ name, phoneNo, password: passHash });
    await user.save();
    return user;
  } catch (error) {
    if (error.message) throw new Error(error.message);
    else throw new Error("Error Signing Up");
  }
};

export const loginUser = async (phoneNo, password) => {
  try {
    const user = await User.findOne({ phoneNo });
    if (!user) throw new Error("User doesn't exist, please signup");
    const passHash = createHash("sha256").update(password).digest("hex");
    if (user.password === passHash) return user;
    return false;
  } catch (error) {
    if (error.message) throw new Error(error.message);
    else throw new Error("Error Logging In");
  }
};

export const tokenDb = async (token) => {
  try {
    const user = await User.findById(token);
    return user;
  } catch (error) {
    throw new Error("Error Occured");
  }
};

export const saveStringSession = async (phoneNo, session) => {
  try {
    const user = await User.findOneAndUpdate(
      { phoneNo: phoneNo },
      { session: session }
    );
  } catch (error) {
    throw new Error("Error Occured");
  }
};
