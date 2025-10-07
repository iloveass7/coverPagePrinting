const PDFDocument = require("pdfkit");
const NodeCache = require("node-cache");

const pdfCache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

const generatePDF = (coverData) => {
  return new Promise((resolve, reject) => {
    try {
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

        pdfCache.set(cacheKey, pdfBuffer);
        resolve(pdfBuffer);
      });
      doc.on("error", reject);

      // cover page design
      doc
        .fontSize(24)
        .font("Helvetica-Bold")
        .text("ASSIGNMENT COVER PAGE", { align: "center" })
        .moveDown(2);

      // Horizontal line
      doc.moveTo(72, doc.y).lineTo(540, doc.y).stroke().moveDown(2);

      // Student Information
      doc.fontSize(12).font("Helvetica-Bold");

      const startY = doc.y;
      const labelX = 100;
      const valueX = 250;
      const lineHeight = 30;

      // Name
      doc.text("Student Name:", labelX, startY);
      doc.font("Helvetica").text(coverData.name, valueX, startY);

      // Student ID
      doc
        .font("Helvetica-Bold")
        .text("Student ID:", labelX, startY + lineHeight);
      doc
        .font("Helvetica")
        .text(coverData.studentId, valueX, startY + lineHeight);

      // Department
      doc
        .font("Helvetica-Bold")
        .text("Department:", labelX, startY + lineHeight * 2);
      doc
        .font("Helvetica")
        .text(coverData.department, valueX, startY + lineHeight * 2);

      // Lab Group
      doc
        .font("Helvetica-Bold")
        .text("Lab Group:", labelX, startY + lineHeight * 3);
      doc
        .font("Helvetica")
        .text(coverData.labGroup, valueX, startY + lineHeight * 3);

      doc.moveDown(6);

      // Assignment Details Section
      doc.moveTo(72, doc.y).lineTo(540, doc.y).stroke().moveDown(1);

      doc
        .fontSize(14)
        .font("Helvetica-Bold")
        .text("ASSIGNMENT DETAILS", { align: "center" })
        .moveDown(1);

      doc.moveTo(72, doc.y).lineTo(540, doc.y).stroke().moveDown(2);

      doc.fontSize(12);
      const detailsY = doc.y;

      // Assignment No
      doc.font("Helvetica-Bold").text("Assignment No:", labelX, detailsY);
      doc.font("Helvetica").text(coverData.assignmentNo, valueX, detailsY);

      // Assignment Name
      doc
        .font("Helvetica-Bold")
        .text("Assignment Name:", labelX, detailsY + lineHeight);
      doc
        .font("Helvetica")
        .text(coverData.assignmentName, valueX, detailsY + lineHeight, {
          width: 280,
          align: "left",
        });

      // Submission Date
      doc
        .font("Helvetica-Bold")
        .text("Submission Date:", labelX, detailsY + lineHeight * 2.5);
      doc
        .font("Helvetica")
        .text(coverData.submissionDate, valueX, detailsY + lineHeight * 2.5);

      // Teacher
      doc
        .font("Helvetica-Bold")
        .text("Submitted To:", labelX, detailsY + lineHeight * 3.5);
      doc
        .font("Helvetica")
        .text(coverData.teacher, valueX, detailsY + lineHeight * 3.5);

      // Footer
      doc
        .fontSize(10)
        .font("Helvetica-Oblique")
        .text(
          `Generated on ${new Date().toLocaleString("en-US", {
            dateStyle: "long",
            timeStyle: "short",
          })}`,
          72,
          doc.page.height - 100,
          { align: "center" }
        );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { generatePDF };
