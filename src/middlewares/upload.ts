import fs from "node:fs";
import path from "node:path";
import type { Request, RequestHandler } from "express";
import multer from "multer";
import { AppError } from "../utils/app-error.js";
import { propertyUploadsDir, toStoredPropertyImagePath } from "../utils/media.js";

const MAX_IMAGES = 5;
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

fs.mkdirSync(propertyUploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, propertyUploadsDir);
  },
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase() || ".jpg";
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1_000_000_000)}`;
    callback(null, `${uniqueSuffix}${extension}`);
  },
});

const upload = multer({
  storage,
  limits: {
    files: MAX_IMAGES,
    fileSize: MAX_IMAGE_SIZE_BYTES,
  },
  fileFilter: (_req, file, callback) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      callback(new AppError("Only image files are allowed (jpg, png, webp, gif)", 400));
      return;
    }

    callback(null, true);
  },
});

const uploadImages = upload.array("images", MAX_IMAGES);

export const uploadPropertyImages: RequestHandler = (req, res, next) => {
  uploadImages(req, res, (error) => {
    if (!error) {
      next();
      return;
    }

    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        next(new AppError("Each image must be 5 MB or smaller", 400));
        return;
      }

      if (error.code === "LIMIT_FILE_COUNT") {
        next(new AppError("You can upload a maximum of 5 images", 400));
        return;
      }

      next(new AppError(error.message, 400));
      return;
    }

    next(error);
  });
};

export const getUploadedPropertyImagePaths = (req: Request): string[] => {
  if (!Array.isArray(req.files)) {
    return [];
  }

  return req.files
    .map((file) => toStoredPropertyImagePath(file.filename))
    .filter((value) => value.trim().length > 0);
};
