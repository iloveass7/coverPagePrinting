// utils/validator.js

/**
 * Validate cover page data
 */
const validateCoverData = (data) => {
  const errors = [];

  // Required fields
  const requiredFields = [
    "name",
    "studentId",
    "department",
    "program",
    "labGroup",
    "assignmentNo",
    "submissionDate",
    "teacher",
  ];

  // Check for missing fields
  requiredFields.forEach((field) => {
    if (field === "teacher") {
      // Teacher can be string, object, or array
      if (
        !data[field] ||
        (Array.isArray(data[field]) && data[field].length === 0)
      ) {
        errors.push("At least one teacher is required");
      } else if (Array.isArray(data[field])) {
        // Check if any teacher entry is empty
        data[field].forEach((t, idx) => {
          if (typeof t === "string" && t.trim() === "") {
            errors.push(`Teacher ${idx + 1} name cannot be empty`);
          } else if (
            typeof t === "object" &&
            (!t.name || t.name.trim() === "")
          ) {
            errors.push(`Teacher ${idx + 1} name is required`);
          }
        });
      } else if (typeof data[field] === "string" && data[field].trim() === "") {
        errors.push("teacher is required");
      } else if (
        typeof data[field] === "object" &&
        (!data[field].name || data[field].name.trim() === "")
      ) {
        errors.push("teacher name is required");
      }
    } else if (!data[field] || data[field].toString().trim() === "") {
      errors.push(`${field} is required`);
    }
  });

  // Validate specific field formats
  if (data.studentId && !/^[a-zA-Z0-9-]+$/.test(data.studentId)) {
    errors.push("Student ID should contain only letters, numbers, and hyphens");
  }

  if (data.name && data.name.length < 2) {
    errors.push("Name must be at least 2 characters long");
  }

  if (data.name && data.name.length > 100) {
    errors.push("Name must not exceed 100 characters");
  }

  if (data.program && data.program.length > 150) {
    errors.push("Program name must not exceed 150 characters");
  }

  // Optional fields validation
  if (data.courseTitle && data.courseTitle.length > 200) {
    errors.push("Course title must not exceed 200 characters");
  }

  if (data.assignmentName && data.assignmentName.length > 200) {
    errors.push("Assignment name must not exceed 200 characters");
  }

  // Validate date format (basic check)
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

/**
 * Sanitize input data
 */
const sanitizeData = (data) => {
  const sanitized = {};

  for (const key in data) {
    if (typeof data[key] === "string") {
      // Trim whitespace and remove potential XSS characters
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
