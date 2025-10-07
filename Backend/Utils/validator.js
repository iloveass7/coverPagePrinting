const validateCoverData = (data) => {
  const errors = [];

  const requiredFields = [
    "name",
    "studentId",
    "department",
    "labGroup",
    "assignmentNo",
    "assignmentName",
    "submissionDate",
    "teacher",
  ];

  requiredFields.forEach((field) => {
    if (!data[field] || data[field].toString().trim() === "") {
      errors.push(`${field} is required`);
    }
  });

  if (data.studentId && !/^[a-zA-Z0-9-]+$/.test(data.studentId)) {
    errors.push("Student ID should contain only letters, numbers, and hyphens");
  }

  if (data.name && data.name.length < 2) {
    errors.push("Name must be at least 2 characters long");
  }

  if (data.name && data.name.length > 100) {
    errors.push("Name must not exceed 100 characters");
  }

  if (data.assignmentName && data.assignmentName.length > 200) {
    errors.push("Assignment name must not exceed 200 characters");
  }

  if (data.submissionDate) {
    const datePattern = /^\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4}$/;
    if (
      !datePattern.test(data.submissionDate) &&
      isNaN(Date.parse(data.submissionDate))
    ) {
      errors.push("Invalid date format for submission date");
    }
  }

  return {
    isValid: errors.length === 0,
    errors: errors,
  };
};

const sanitizeData = (data) => {
  const sanitized = {};

  for (const key in data) {
    if (typeof data[key] === "string") {
      sanitized[key] = data[key].trim().replace(/[<>]/g, ""); // Remove < and > to prevent basic XSS
    } else {
      sanitized[key] = data[key];
    }
  }

  return sanitized;
};

module.exports = {
  validateCoverData,
  sanitizeData,
};
