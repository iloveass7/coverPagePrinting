// utils/pdfGenerator.js
const PDFDocument = require("pdfkit");
const NodeCache = require("node-cache");

// Cache for 1 hour (3600 seconds)
const pdfCache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

const generatePDF = (coverData) => {
  return new Promise((resolve, reject) => {
    try {
      // Create cache key from data
      const cacheKey = JSON.stringify(coverData);

      // Check cache
      const cachedPDF = pdfCache.get(cacheKey);
      if (cachedPDF) {
        console.log("Returning cached PDF");
        return resolve(Buffer.from(cachedPDF));
      }

      const doc = new PDFDocument({
        size: "A4",
        margins: { top: 50, bottom: 50, left: 72, right: 72 },
      });

      const buffers = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        const pdfBuffer = Buffer.concat(buffers);
        // Cache the generated PDF
        pdfCache.set(cacheKey, pdfBuffer);
        resolve(pdfBuffer);
      });
      doc.on("error", reject);

      // CUSTOMIZE YOUR COVER PAGE DESIGN HERE
      // ====================================

      // University Logo (centered at top)
      // If you have a logo file, uncomment and use:
      // doc.image('path/to/logo.png', 250, 50, { width: 100, align: 'center' });
      // doc.moveDown(3);

      // University Header
      doc
        .fontSize(16)
        .font("Helvetica-Bold")
        .text("Ahsanullah University of Science and Technology", {
          align: "center",
        })
        .moveDown(0.5);

      doc
        .fontSize(12)
        .font("Helvetica")
        .text(`Department of ${coverData.department}`, { align: "center" })
        .moveDown(2);

      // Program Details
      doc
        .fontSize(11)
        .font("Helvetica")
        .text(`Program: ${coverData.program}`, { align: "center" })
        .moveDown(0.3);

      // Course Information (if provided)
      if (coverData.courseNo) {
        doc
          .text(`Course No: ${coverData.courseNo}`, { align: "center" })
          .moveDown(0.3);
      }

      if (coverData.courseTitle) {
        doc
          .text(`Course Title: ${coverData.courseTitle}`, { align: "center" })
          .moveDown(2);
      } else {
        doc.moveDown(2);
      }

      // Assignment Number (Bold and centered)
      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text(`Assignment No: ${coverData.assignmentNo}`, { align: "center" })
        .moveDown(0.5);

      // Assignment Name (if provided)
      if (coverData.assignmentName) {
        doc
          .fontSize(11)
          .font("Helvetica")
          .text(`Assignment Name: ${coverData.assignmentName}`, {
            align: "center",
          })
          .moveDown(0.5);
      }

      // Date of Submission
      doc
        .fontSize(11)
        .font("Helvetica")
        .text(`Date of Submission: ${coverData.submissionDate}`, {
          align: "center",
        })
        .moveDown(3);

      // Submitted To Section
      doc
        .fontSize(11)
        .font("Helvetica-Bold")
        .text("Submitted To:", 72, doc.y)
        .moveDown(0.5);

      // Handle multiple teachers (array or single string/object)
      let teachers = [];
      if (Array.isArray(coverData.teacher)) {
        teachers = coverData.teacher;
      } else {
        teachers = [coverData.teacher];
      }

      teachers.forEach((teacher, index) => {
        // Teacher can be string or object {name, department}
        const teacherName =
          typeof teacher === "string" ? teacher : teacher.name;
        const teacherDept =
          typeof teacher === "object" && teacher.department
            ? teacher.department
            : coverData.department; // Use student's department as default

        doc.font("Helvetica").text(teacherName, 72).moveDown(0.3);
        doc.text(`Department of ${teacherDept}, AUST.`, 72);

        // Add extra space if not the last teacher
        if (index < teachers.length - 1) {
          doc.moveDown(0.5);
        }
      });

      doc.moveDown(3);

      // Submitted By Section
      doc.font("Helvetica-Bold").text("Submitted By:", 72, doc.y).moveDown(0.5);

      doc.font("Helvetica").text(coverData.name, 72).moveDown(0.3);

      doc.text(`ID: ${coverData.studentId}`, 72).moveDown(0.3);

      doc.text(`Lab Group: ${coverData.labGroup}`, 72);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { generatePDF };
