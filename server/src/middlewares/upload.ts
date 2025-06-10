// middleware/upload.ts
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, "public/uploads/providerServices/");
  },
  filename: function (_req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // e.g., 1673512351.jpg
  },
});

export const upload = multer({ storage });
