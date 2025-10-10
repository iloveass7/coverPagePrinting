const { generatePDF } = require("../Utils/pdfGenerator");
const { generateDOCX } = require("../Utils/docxGenerator");
const { sendEmail } = require("../Utils/emailService");
const { generateToken } = require("../Utils/tokenGenerator");
const { validateCoverData } = require("../Utils/validator");

// Download PDF
const downloadPDF = async (req, res) => {
  try {
    const coverData = req.body;

    const validation = validateCoverData(coverData);
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.errors });
    }

    const pdfBuffer = await generatePDF(coverData);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Ass_${coverData.assignmentNo}_${coverData.studentId}.pdf`
    );
    res.setHeader("Content-Length", pdfBuffer.length);

    res.send(pdfBuffer);
  } catch (error) {
    console.error("PDF generation error:", error);
    res
      .status(500)
      .json({ error: "Failed to generate PDF", message: error.message });
  }
};

const downloadDOCX = async (req, res) => {
  try {
    const coverData = req.body;

    const validation = validateCoverData(coverData);
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.errors });
    }

    const docxBuffer = await generateDOCX(coverData);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Ass_${coverData.assignmentNo}_${coverData.studentId}.docx`
    );
    res.setHeader("Content-Length", docxBuffer.length);

    res.send(docxBuffer);
  } catch (error) {
    console.error("DOCX generation error:", error);
    res
      .status(500)
      .json({ error: "Failed to generate DOCX", message: error.message });
  }
};

const sendToShop = async (req, res) => {
  try {
    const coverData = req.body;

    const validation = validateCoverData(coverData);
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.errors });
    }

    const token = generateToken(coverData);

    const pdfBuffer = await generatePDF(coverData);

    const emailResult = await sendEmail(coverData, pdfBuffer, token);

    if (emailResult.success) {
      res.status(200).json({
        success: true,
        token: token,
        message: "PDF sent to print shop successfully",
      });
    } else {
      res.status(500).json({
        success: false,
        error: "Failed to send email",
        message: emailResult.error,
      });
    }
  } catch (error) {
    console.error("Send to shop error:", error);
    res
      .status(500)
      .json({ error: "Failed to send to print shop", message: error.message });
  }
};

module.exports = {
  downloadPDF,
  downloadDOCX,
  sendToShop,
};
