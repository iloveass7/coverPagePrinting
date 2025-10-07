// utils/docxGenerator.js
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
} = require("docx");
const NodeCache = require("node-cache");

// Cache for 1 hour
const docxCache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

const generateDOCX = async (coverData) => {
  try {
    // Create cache key
    const cacheKey = JSON.stringify(coverData);

    // Check cache
    const cachedDOCX = docxCache.get(cacheKey);
    if (cachedDOCX) {
      console.log("Returning cached DOCX");
      return Buffer.from(cachedDOCX);
    }

    // CUSTOMIZE YOUR COVER PAGE DESIGN HERE

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            // Title
            new Paragraph({
              text: "ASSIGNMENT COVER PAGE",
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 },
              style: "Heading1",
            }),

            // Horizontal line (simulated with border)
            new Paragraph({
              border: {
                bottom: {
                  color: "000000",
                  space: 1,
                  style: BorderStyle.SINGLE,
                  size: 6,
                },
              },
              spacing: { after: 400 },
            }),

            // Student Name
            new Paragraph({
              spacing: { after: 200 },
              children: [
                new TextRun({
                  text: "Student Name: ",
                  bold: true,
                  size: 24,
                }),
                new TextRun({
                  text: coverData.name,
                  size: 24,
                }),
              ],
            }),

            // Student ID
            new Paragraph({
              spacing: { after: 200 },
              children: [
                new TextRun({
                  text: "Student ID: ",
                  bold: true,
                  size: 24,
                }),
                new TextRun({
                  text: coverData.studentId,
                  size: 24,
                }),
              ],
            }),

            // Department
            new Paragraph({
              spacing: { after: 200 },
              children: [
                new TextRun({
                  text: "Department: ",
                  bold: true,
                  size: 24,
                }),
                new TextRun({
                  text: coverData.department,
                  size: 24,
                }),
              ],
            }),

            // Lab Group
            new Paragraph({
              spacing: { after: 400 },
              children: [
                new TextRun({
                  text: "Lab Group: ",
                  bold: true,
                  size: 24,
                }),
                new TextRun({
                  text: coverData.labGroup,
                  size: 24,
                }),
              ],
            }),

            // Section divider
            new Paragraph({
              border: {
                top: {
                  color: "000000",
                  space: 1,
                  style: BorderStyle.SINGLE,
                  size: 6,
                },
                bottom: {
                  color: "000000",
                  space: 1,
                  style: BorderStyle.SINGLE,
                  size: 6,
                },
              },
              spacing: { before: 200, after: 200 },
            }),

            // Assignment Details Header
            new Paragraph({
              text: "ASSIGNMENT DETAILS",
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 },
              style: "Heading2",
            }),

            // Section divider
            new Paragraph({
              border: {
                bottom: {
                  color: "000000",
                  space: 1,
                  style: BorderStyle.SINGLE,
                  size: 6,
                },
              },
              spacing: { after: 400 },
            }),

            // Assignment No
            new Paragraph({
              spacing: { after: 200 },
              children: [
                new TextRun({
                  text: "Assignment No: ",
                  bold: true,
                  size: 24,
                }),
                new TextRun({
                  text: coverData.assignmentNo,
                  size: 24,
                }),
              ],
            }),

            // Assignment Name
            new Paragraph({
              spacing: { after: 200 },
              children: [
                new TextRun({
                  text: "Assignment Name: ",
                  bold: true,
                  size: 24,
                }),
                new TextRun({
                  text: coverData.assignmentName,
                  size: 24,
                }),
              ],
            }),

            // Submission Date
            new Paragraph({
              spacing: { after: 200 },
              children: [
                new TextRun({
                  text: "Submission Date: ",
                  bold: true,
                  size: 24,
                }),
                new TextRun({
                  text: coverData.submissionDate,
                  size: 24,
                }),
              ],
            }),

            // Teacher
            new Paragraph({
              spacing: { after: 400 },
              children: [
                new TextRun({
                  text: "Submitted To: ",
                  bold: true,
                  size: 24,
                }),
                new TextRun({
                  text: coverData.teacher,
                  size: 24,
                }),
              ],
            }),

            // Footer
            new Paragraph({
              text: `Generated on ${new Date().toLocaleString("en-US", {
                dateStyle: "long",
                timeStyle: "short",
              })}`,
              alignment: AlignmentType.CENTER,
              spacing: { before: 600 },
              italics: true,
            }),
          ],
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);

    // Cache the generated DOCX
    docxCache.set(cacheKey, buffer);

    return buffer;
  } catch (error) {
    throw error;
  }
};

module.exports = { generateDOCX };
