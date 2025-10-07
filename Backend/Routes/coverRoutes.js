const express = require("express");
const router = express.Router();
const coverController = require("../Controllers/coverController");

router.post("/download/pdf", coverController.downloadPDF);

router.post("/download/docx", coverController.downloadDOCX);

router.post("/send-to-shop", coverController.sendToShop);

module.exports = router;
