import { Router } from "express";
import {
  errorTest,
  signUpHandler,
  test,
  loginHandler,
} from "../controllers/common.js";
import { sendCodeHandler, teleLoginHandler } from "../controllers/auth.js";
import { authMiddleware } from "../middleware/authorize.js";
import multer from "multer";
import { FileHandler, fileDownloadHandler } from "../controllers/sendFile.js";
import {
  addToCollection,
  removeFromCollection,
  createCollection,
  getAllCollections,
  getAllFiles,
  handleFavourite,
  renameCollection,
  renameFile,
  removeAllFavourites,
} from "../controllers/collections.js";
import {
  addToBin,
  restoreFromBin,
  permanentlyDelete,
  emptyBin,
  restoreAll,
} from "../controllers/bin.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "files/"); // Specify the directory where files will be stored
  },
  filename: function (req, file, cb) {
    req.fileName = Date.now() + file.originalname;
    req.fileOrgName = file.originalname;
    cb(null, Date.now() + file.originalname); // Use the original file name for saving
  },
});

const upload = multer({ storage: storage });

export const router = Router();

router.get("/test", test);
router.get("/error", errorTest);

router.post("/signup", signUpHandler);
router.post("/login", loginHandler);

router.post("/sendCode", authMiddleware, sendCodeHandler);
router.post("/loginTelegram", authMiddleware, teleLoginHandler);

router.post("/uploadFile", upload.single("file"), authMiddleware, FileHandler);

router.post("/getAllFiles", authMiddleware, getAllFiles);
router.post("/getAllCollections", authMiddleware, getAllCollections);

router.post("/createCollection", authMiddleware, createCollection);
router.post("/addToCollection", authMiddleware, addToCollection);
router.post("/removeFromCollection", authMiddleware, removeFromCollection);

router.post("/download", authMiddleware, fileDownloadHandler);
router.put("/handleFavourite", authMiddleware, handleFavourite);
router.put("/removeAllFavourites", authMiddleware, removeAllFavourites);

router.put("/addToBin", authMiddleware, addToBin);
router.put("/restoreFromBin", authMiddleware, restoreFromBin);
router.put("/permanentlyDelete", authMiddleware, permanentlyDelete);
router.put("/emptyBin", authMiddleware, emptyBin);
router.put("/restoreAll", authMiddleware, restoreAll);

router.put("/renameCollection", authMiddleware, renameCollection);
router.put("/renameFile", authMiddleware, renameFile);
