const crypto = require("crypto");

const generateToken = (coverData) => {
  const studentId = coverData.studentId.replace(/[^0-9]/g, "");
  const last3Digits = studentId.slice(-3).padStart(3, "0");

  const dataString = `${coverData.studentId}${
    coverData.assignmentNo
  }${Date.now()}`;
  const hash = crypto
    .createHash("md5")
    .update(dataString)
    .digest("hex")
    .substring(0, 2)
    .toUpperCase();

  const deptAbbr =
    coverData.department
      .replace(/[^a-zA-Z\s]/g, "")
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 3) || coverData.department.substring(0, 3).toUpperCase();

  const token = `${last3Digits}-${hash}-${deptAbbr}`;

  return token;
};

const generateSimpleToken = (coverData) => {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 9000 + 1000);
  return `ASGN${timestamp}${random}`;
};

const generateStudentToken = (coverData) => {
  const prefix = "ASGN";
  const studentId = coverData.studentId
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase();
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 900 + 100);

  return `${prefix}-${studentId}-${timestamp}${random}`;
};

module.exports = {
  generateToken,
  generateSimpleToken,
  generateStudentToken,
};
