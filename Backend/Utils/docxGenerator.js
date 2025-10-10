// utils/docxGenerator.js
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  HeadingLevel,
  ImageRun,
} = require("docx");
const NodeCache = require("node-cache");
const fs = require("fs");

const path = require("path");
const logoPath = path.join(__dirname, "../Resources/austlogo.png");
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
    // ====================================

    const children = [];

    // Logo (if you have one, uncomment and provide path)

    if (fs.existsSync(logoPath)) {
      children.push(
        new Paragraph({
          children: [
            new ImageRun({
              data: fs.readFileSync(logoPath),
              transformation: {
                width: 150,
                height: 170,
              },
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        })
      );
    }

    // University Header
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Ahsanullah University of Science and Technology",
            font: "Helvetica Bold",
            size: 32, // 16pt
            bold: true,
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
      })
    );

    // Department
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Department of ${coverData.department}`,
            font: "Helvetica",
            size: 24, // 12pt
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      })
    );

    // Course No (if provided)
    if (coverData.courseNo) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `Course No: ${coverData.courseNo}`,
              font: "Helvetica",
              size: 22, // 11pt
            }),
          ],
          alignment: AlignmentType.LEFT,
          spacing: { after: 60 },
        })
      );
    }

    // Course Title (if provided)
    if (coverData.courseTitle) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `Course Title: ${coverData.courseTitle}`,
              font: "Helvetica",
              size: 22, // 11pt
            }),
          ],
          alignment: AlignmentType.LEFT,
          spacing: { after: 400 },
        })
      );
    } else {
      children.push(new Paragraph({ spacing: { after: 400 } }));
    }

    // Assignment Number (Bold)
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Assignment No: ${coverData.assignmentNo}`,
            font: "Helvetica",
            size: 24, // 12pt
            bold: true,
          }),
        ],
        alignment: AlignmentType.LEFT,
        spacing: { after: 100 },
      })
    );

    // Assignment Name (if provided)
    if (coverData.assignmentName) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `Assignment Name: ${coverData.assignmentName}`,
              font: "Helvetica",
              size: 22, // 11pt
            }),
          ],
          alignment: AlignmentType.LEFT,
          spacing: { after: 100 },
        })
      );
    }

    // Date of Submission
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Date of Submission: ${coverData.submissionDate}`,
            font: "Helvetica",
            size: 22, // 11pt
          }),
        ],
        alignment: AlignmentType.LEFT,
        spacing: { after: 600 },
      })
    );

    // Submitted To (Bold, Left-aligned)
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Submitted To:",
            font: "Helvetica",
            size: 22, // 11pt
            bold: true,
          }),
        ],
        spacing: { after: 100 },
      })
    );

    // Handle multiple teachers
    let teachers = [];
    if (Array.isArray(coverData.teacher)) {
      teachers = coverData.teacher;
    } else {
      teachers = [coverData.teacher];
    }

    teachers.forEach((teacher, index) => {
      const teacherName = typeof teacher === "string" ? teacher : teacher.name;
      const teacherDept =
        typeof teacher === "object" && teacher.department
          ? teacher.department
          : coverData.department;

      // Teacher Name
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: teacherName,
              font: "Helvetica",
              size: 22, // 11pt
            }),
          ],
          spacing: { after: 60 },
        })
      );

      // Teacher Department
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `Department of ${teacherDept}, AUST.`,
              font: "Helvetica",
              size: 22, // 11pt
            }),
          ],
          spacing: { after: index < teachers.length - 1 ? 100 : 600 },
        })
      );
    });

    // Submitted By (Bold, Left-aligned)
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Submitted By:",
            font: "Helvetica",
            size: 22, // 11pt
            bold: true,
          }),
        ],
        spacing: { after: 100 },
      })
    );

    // Student Name
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: coverData.name,
            font: "Helvetica",
            size: 22, // 11pt
          }),
        ],
        spacing: { after: 60 },
      })
    );

    // Student ID
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `ID: ${coverData.studentId}`,
            font: "Helvetica",
            size: 22, // 11pt
          }),
        ],
        spacing: { after: 60 },
      })
    );

    // Lab Group
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Lab Group: ${coverData.labGroup}`,
            font: "Helvetica",
            size: 22, // 11pt
          }),
        ],
        spacing: { after: 200 },
      })
    );

    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 1440, // 1 inch = 1440 twips
                right: 1440,
                bottom: 1440,
                left: 1440,
              },
            },
          },
          children: children,
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
