import { Router } from "express";
import multer from "multer";

import { analyzeImage } from "../implementation/googgle-vision";
import { extractImageDescription } from "../implementation/google-gemini";

export const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

router.get("/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

router.post("/vision/analyze", upload.single("image"), async (req, res) => {
  const file = req.file;
  if (!file) {
    res.status(400).json({ error: "Missing file field 'image'" });
    return;
  }

  const result = await analyzeImage(file.buffer);
  res.status(200).json(result);
});

router.post("/vision/describe", upload.single("image"), async (req, res) => {
  const file = req.file;
  if (!file) {
    res.status(400).json({ error: "Missing file field 'image'" });
    return;
  }

  const info = {
    sex: req.body.sex || "unknown",
    species: req.body.species || "unknown",
  };

  const result = await extractImageDescription(file.buffer, info);
  res.status(200).json(result);
});
