/* ============================================================
   CarbonX — Validator (validator.js)
   Purpose: All form validation logic for login, register,
            buy/sell, profile, reports, and search inputs
   Depends on: constants.js, helpers.js (must load first)
   ============================================================ */


/* ============================================================
   1. BASE VALIDATOR — Single field rules
   ============================================================ */

/**
 * Check if a value is empty
 */
function isEmpty(value) {
  return !value || value.toString().trim() === '';
}

/**
 * Check if email format is valid
 */
function isValidEmail(email) {
  return VALIDATION.EMAIL_REGEX.test(String(email).trim().toLowerCase());
}

/**
 * Check if password meets minimum length
 */
function isValidPassword(password) {
  return password && password.length >= VALIDATION.PASSWORD_MIN;
}

/**
 * Check if two passwords match
 */
function passwordsMatch(pass1, pass2) {
  return pass1 === pass2;
}

/**
 * Check if name meets min/max length
 */
function isValidName(name) {
  const trimmed = (name || '').trim();
  return trimmed.length >= VALIDATION.NAME_MIN &&
    trimmed.length <= VALIDATION.NAME_MAX;
}

/**
 * Check if quantity is valid number
 */
function isValidQuantity(qty) {
  const num = parseInt(qty);
  return !isNaN(num) &&
    num >= VALIDATION.MIN_BUY_QTY &&
    num <= VALIDATION.MAX_BUY_QTY;
}

/**
 * Check if a role is valid
 */
function isValidRole(role) {
  return Object.values(ROLES).includes(role);
}

/**
 * Check if a date string is valid
 */
function isValidDate(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  return d instanceof Date && !isNaN(d);
}

/**
 * Check if start date is before end date
 */
function isValidDateRange(startDate, endDate) {
  if (!isValidDate(startDate) || !isValidDate(endDate)) return false;
  return new Date(startDate) <= new Date(endDate);
}

/**
 * Check if a number is positive
 */
function isPositiveNumber(value) {
  return !isNaN(value) && parseFloat(value) > 0;
}


/* ============================================================
   2. FORM VALIDATORS — Full form objects
   ============================================================ */

/**
 * Validate LOGIN form
 * Returns: { valid: bool, errors: { email, password } }
 */
function validateLogin(data) {
  const errors = {};

  if (isEmpty(data.email)) {
    errors.email = VALIDATION_MESSAGES.EMAIL_REQUIRED;
  } else if (!isValidEmail(data.email)) {
    errors.email = VALIDATION_MESSAGES.EMAIL_INVALID;
  }

  if (isEmpty(data.password)) {
    errors.password = VALIDATION_MESSAGES.PASSWORD_REQUIRED;
  } else if (!isValidPassword(data.password)) {
    errors.password = VALIDATION_MESSAGES.PASSWORD_SHORT;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate REGISTER form
 * Returns: { valid: bool, errors: { name, email, password, confirmPassword, role } }
 */
function validateRegister(data) {
  const errors = {};

  if (isEmpty(data.name)) {
    errors.name = VALIDATION_MESSAGES.NAME_REQUIRED;
  } else if (!isValidName(data.name)) {
    errors.name = VALIDATION_MESSAGES.NAME_SHORT;
  }

  if (isEmpty(data.email)) {
    errors.email = VALIDATION_MESSAGES.EMAIL_REQUIRED;
  } else if (!isValidEmail(data.email)) {
    errors.email = VALIDATION_MESSAGES.EMAIL_INVALID;
  }

  if (isEmpty(data.password)) {
    errors.password = VALIDATION_MESSAGES.PASSWORD_REQUIRED;
  } else if (!isValidPassword(data.password)) {
    errors.password = VALIDATION_MESSAGES.PASSWORD_SHORT;
  }

  if (isEmpty(data.confirmPassword)) {
    errors.confirmPassword = VALIDATION_MESSAGES.PASSWORD_REQUIRED;
  } else if (!passwordsMatch(data.password, data.confirmPassword)) {
    errors.confirmPassword = VALIDATION_MESSAGES.PASSWORD_MISMATCH;
  }

  if (isEmpty(data.role)) {
    errors.role = VALIDATION_MESSAGES.ROLE_REQUIRED;
  } else if (!isValidRole(data.role)) {
    errors.role = VALIDATION_MESSAGES.ROLE_REQUIRED;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate BUY form
 * Returns: { valid: bool, errors: { quantity }, warnings: [] }
 */
function validateBuy(data, userBalance, projectPrice, availableCredits) {
  const errors = {};
  const warnings = [];

  if (isEmpty(data.quantity)) {
    errors.quantity = VALIDATION_MESSAGES.QTY_REQUIRED;
  } else if (!isPositiveNumber(data.quantity)) {
    errors.quantity = VALIDATION_MESSAGES.QTY_INVALID;
  } else {
    const qty = parseInt(data.quantity);
    const cost = qty * projectPrice;

    if (qty < VALIDATION.MIN_BUY_QTY) {
      errors.quantity = VALIDATION_MESSAGES.QTY_MIN;
    } else if (qty > VALIDATION.MAX_BUY_QTY) {
      errors.quantity = VALIDATION_MESSAGES.QTY_MAX;
    } else if (qty > availableCredits) {
      errors.quantity = `Only ${availableCredits} credits available for this project.`;
    } else if (cost > userBalance) {
      errors.quantity = NOTIFICATION_MESSAGES.INSUFFICIENT_FUNDS;
    } else if (cost > userBalance * 0.8) {
      warnings.push('This purchase will use more than 80% of your balance.');
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate SELL form
 * Returns: { valid: bool, errors: { quantity } }
 */
function validateSell(data, ownedCredits) {
  const errors = {};

  if (isEmpty(data.quantity)) {
    errors.quantity = VALIDATION_MESSAGES.QTY_REQUIRED;
  } else if (!isPositiveNumber(data.quantity)) {
    errors.quantity = VALIDATION_MESSAGES.QTY_INVALID;
  } else {
    const qty = parseInt(data.quantity);
    if (qty < VALIDATION.MIN_BUY_QTY) {
      errors.quantity = VALIDATION_MESSAGES.QTY_MIN;
    } else if (qty > ownedCredits) {
      errors.quantity = NOTIFICATION_MESSAGES.INSUFFICIENT_CREDITS;
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate REPORT date range form
 * Returns: { valid: bool, errors: { startDate, endDate } }
 */
function validateReportRange(data) {
  const errors = {};

  if (isEmpty(data.startDate)) {
    errors.startDate = 'Start date is required.';
  } else if (!isValidDate(data.startDate)) {
    errors.startDate = 'Please enter a valid start date.';
  }

  if (isEmpty(data.endDate)) {
    errors.endDate = 'End date is required.';
  } else if (!isValidDate(data.endDate)) {
    errors.endDate = 'Please enter a valid end date.';
  }

  if (!errors.startDate && !errors.endDate) {
    if (!isValidDateRange(data.startDate, data.endDate)) {
      errors.endDate = 'End date must be after start date.';
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate PROFILE UPDATE form
 * Returns: { valid: bool, errors: { name, email } }
 */
function validateProfileUpdate(data) {
  const errors = {};

  if (isEmpty(data.name)) {
    errors.name = VALIDATION_MESSAGES.NAME_REQUIRED;
  } else if (!isValidName(data.name)) {
    errors.name = VALIDATION_MESSAGES.NAME_SHORT;
  }

  if (isEmpty(data.email)) {
    errors.email = VALIDATION_MESSAGES.EMAIL_REQUIRED;
  } else if (!isValidEmail(data.email)) {
    errors.email = VALIDATION_MESSAGES.EMAIL_INVALID;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate PASSWORD CHANGE form
 * Returns: { valid: bool, errors: { currentPassword, newPassword, confirmPassword } }
 */
function validatePasswordChange(data) {
  const errors = {};

  if (isEmpty(data.currentPassword)) {
    errors.currentPassword = 'Current password is required.';
  }

  if (isEmpty(data.newPassword)) {
    errors.newPassword = VALIDATION_MESSAGES.PASSWORD_REQUIRED;
  } else if (!isValidPassword(data.newPassword)) {
    errors.newPassword = VALIDATION_MESSAGES.PASSWORD_SHORT;
  }

  if (isEmpty(data.confirmPassword)) {
    errors.confirmPassword = VALIDATION_MESSAGES.PASSWORD_REQUIRED;
  } else if (!passwordsMatch(data.newPassword, data.confirmPassword)) {
    errors.confirmPassword = VALIDATION_MESSAGES.PASSWORD_MISMATCH;
  }

  if (data.currentPassword && data.newPassword &&
    data.currentPassword === data.newPassword) {
    errors.newPassword = 'New password must be different from current password.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}


/* ============================================================
   3. UI HELPERS — Show/clear errors on DOM
   ============================================================ */

/**
 * Show an error message below a field
 * fieldId  — input element id
 * message  — error text to show
 */
function showFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const errorEl = document.getElementById(fieldId + '-error');

  if (field) {
    field.style.borderColor = 'var(--negative)';
    field.style.boxShadow = '0 0 0 3px rgba(192,57,43,0.12)';
  }

  if (errorEl) {
    errorEl.textContent = message;
    errorEl.style.display = 'block';
  }
}

/**
 * Clear error message for a field
 */
function clearFieldError(fieldId) {
  const field = document.getElementById(fieldId);
  const errorEl = document.getElementById(fieldId + '-error');

  if (field) {
    field.style.borderColor = '';
    field.style.boxShadow = '';
  }

  if (errorEl) {
    errorEl.textContent = '';
    errorEl.style.display = 'none';
  }
}

/**
 * Clear all errors in a form
 * formEl — the form DOM element
 */
function clearAllErrors(formEl) {
  if (!formEl) return;
  formEl.querySelectorAll('.form-error').forEach(el => {
    el.textContent = '';
    el.style.display = 'none';
  });
  formEl.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(el => {
    el.style.borderColor = '';
    el.style.boxShadow = '';
  });
}

/**
 * Show all errors from a validation result on the form
 * errors — object like { fieldId: 'message' }
 */
function showFormErrors(errors) {
  Object.entries(errors).forEach(([fieldId, message]) => {
    showFieldError(fieldId, message);
  });
}

/**
 * Mark field as valid (green border)
 */
function showFieldSuccess(fieldId) {
  const field = document.getElementById(fieldId);
  if (field) {
    field.style.borderColor = 'var(--positive)';
    field.style.boxShadow = '0 0 0 3px rgba(39,174,96,0.1)';
  }
}

/**
 * Attach real-time validation to an input
 * Clears error on input, validates on blur
 */
function attachFieldValidation(fieldId, validateFn) {
  const field = document.getElementById(fieldId);
  if (!field) return;

  field.addEventListener('input', () => {
    clearFieldError(fieldId);
  });

  field.addEventListener('blur', () => {
    const result = validateFn(field.value);
    if (!result.valid) {
      showFieldError(fieldId, result.message);
    }
  });
}


/* ============================================================
   4. INLINE VALIDATORS — Single field quick checks
   Used with attachFieldValidation
   ============================================================ */

const fieldValidators = {

  email: (value) => {
    if (isEmpty(value)) return { valid: false, message: VALIDATION_MESSAGES.EMAIL_REQUIRED };
    if (!isValidEmail(value)) return { valid: false, message: VALIDATION_MESSAGES.EMAIL_INVALID };
    return { valid: true };
  },

  password: (value) => {
    if (isEmpty(value)) return { valid: false, message: VALIDATION_MESSAGES.PASSWORD_REQUIRED };
    if (!isValidPassword(value)) return { valid: false, message: VALIDATION_MESSAGES.PASSWORD_SHORT };
    return { valid: true };
  },

  name: (value) => {
    if (isEmpty(value)) return { valid: false, message: VALIDATION_MESSAGES.NAME_REQUIRED };
    if (!isValidName(value)) return { valid: false, message: VALIDATION_MESSAGES.NAME_SHORT };
    return { valid: true };
  },

  quantity: (value) => {
    if (isEmpty(value)) return { valid: false, message: VALIDATION_MESSAGES.QTY_REQUIRED };
    if (!isPositiveNumber(value)) return { valid: false, message: VALIDATION_MESSAGES.QTY_INVALID };
    if (parseInt(value) < 1) return { valid: false, message: VALIDATION_MESSAGES.QTY_MIN };
    return { valid: true };
  },

};


/* ============================================================
   5. EXPORT — Make all validators globally available
   ============================================================ */
window.isEmpty = isEmpty;
window.isValidEmail = isValidEmail;
window.isValidPassword = isValidPassword;
window.passwordsMatch = passwordsMatch;
window.isValidName = isValidName;
window.isValidQuantity = isValidQuantity;
window.isValidRole = isValidRole;
window.isValidDate = isValidDate;
window.isValidDateRange = isValidDateRange;
window.isPositiveNumber = isPositiveNumber;

window.validateLogin = validateLogin;
window.validateRegister = validateRegister;
window.validateBuy = validateBuy;
window.validateSell = validateSell;
window.validateReportRange = validateReportRange;
window.validateProfileUpdate = validateProfileUpdate;
window.validatePasswordChange = validatePasswordChange;

window.showFieldError = showFieldError;
window.clearFieldError = clearFieldError;
window.clearAllErrors = clearAllErrors;
window.showFormErrors = showFormErrors;
window.showFieldSuccess = showFieldSuccess;
window.attachFieldValidation = attachFieldValidation;
window.fieldValidators = fieldValidators;