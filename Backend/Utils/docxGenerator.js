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
    // ====================================

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            // University Header
            new Paragraph({
              text: "Ahsanullah University of Science and Technology",
              alignment: AlignmentType.CENTER,
              spacing: { after: 100 },
              style: "Heading1",
            }),

            // Department
            new Paragraph({
              text: `Department of ${coverData.department}`,
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 },
            }),

            // Program
            new Paragraph({
              text: `Program: ${coverData.program}`,
              alignment: AlignmentType.CENTER,
              spacing: { after: 100 },
            }),

            // Course No (if provided)
            ...(coverData.courseNo
              ? [
                  new Paragraph({
                    text: `Course No: ${coverData.courseNo}`,
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 100 },
                  }),
                ]
              : []),

            // Course Title (if provided)
            ...(coverData.courseTitle
              ? [
                  new Paragraph({
                    text: `Course Title: ${coverData.courseTitle}`,
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 400 },
                  }),
                ]
              : [new Paragraph({ spacing: { after: 400 } })]),

            // Assignment Number
            new Paragraph({
              spacing: { after: 100 },
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: `Assignment No: ${coverData.assignmentNo}`,
                  bold: true,
                  size: 24,
                }),
              ],
            }),

            // Assignment Name (if provided)
            ...(coverData.assignmentName
              ? [
                  new Paragraph({
                    text: `Assignment Name: ${coverData.assignmentName}`,
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 100 },
                  }),
                ]
              : []),

            // Date of Submission
            new Paragraph({
              text: `Date of Submission: ${coverData.submissionDate}`,
              alignment: AlignmentType.CENTER,
              spacing: { after: 600 },
            }),

            // Submitted To
            new Paragraph({
              spacing: { after: 100 },
              children: [
                new TextRun({
                  text: "Submitted To:",
                  bold: true,
                  size: 24,
                }),
              ],
            }),

            // Handle multiple teachers
            ...(Array.isArray(coverData.teacher)
              ? coverData.teacher
              : [coverData.teacher]
            ).flatMap((teacher, index, arr) => {
              const teacherName =
                typeof teacher === "string" ? teacher : teacher.name;
              const teacherDept =
                typeof teacher === "object" && teacher.department
                  ? teacher.department
                  : coverData.department;

              return [
                new Paragraph({
                  text: teacherName,
                  spacing: { after: 100 },
                }),
                new Paragraph({
                  text: `Department of ${teacherDept}, AUST.`,
                  spacing: { after: index < arr.length - 1 ? 200 : 600 },
                }),
              ];
            }),

            // Submitted By
            new Paragraph({
              spacing: { after: 100 },
              children: [
                new TextRun({
                  text: "Submitted By:",
                  bold: true,
                  size: 24,
                }),
              ],
            }),

            new Paragraph({
              text: coverData.name,
              spacing: { after: 100 },
            }),

            new Paragraph({
              text: `ID: ${coverData.studentId}`,
              spacing: { after: 100 },
            }),

            new Paragraph({
              text: `Lab Group: ${coverData.labGroup}`,
              spacing: { after: 200 },
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
