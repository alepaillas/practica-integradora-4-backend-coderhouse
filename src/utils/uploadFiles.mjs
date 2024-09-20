import multer from "multer";
import fs from "fs";
import customErrors from "../errors/customErrors.mjs";
import path from "path";

const uploadsPath = new URL("../public/uploads", import.meta.url).pathname;
const profilesPath = new URL("../public/uploads/profiles", import.meta.url)
  .pathname;
const productsPath = new URL("../public/uploads/products", import.meta.url)
  .pathname;
const documentsPath = new URL("../public/uploads/documents", import.meta.url)
  .pathname;

const ensureDirectoriesExist = () => {
  const directories = [uploadsPath, profilesPath, productsPath, documentsPath];
  directories.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  });
};
ensureDirectoriesExist();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    switch (file.fieldname) {
      case "profile":
        cb(null, profilesPath);
        break;
      case "product":
        cb(null, productsPath);
        break;
      case "document":
        cb(null, documentsPath);
        break;
      default:
        cb(customErrors.badRequestError("Invalid fieldname"), null);
        break;
    }
  },
  filename: (req, file, cb) => {
    const userID = req.user._id;
    const fileExtension = path.extname(file.originalname);
    const basename = path.basename(file.originalname, fileExtension);
    cb(null, `${basename}-${userID}${fileExtension}`);
  },
});

export const upload = multer({ storage });
