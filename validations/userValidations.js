const userValidations = {
  isFNameValid: (fname) => {
    if (fname.length < 2) return false;
    if (/[!@#$%^&*()]/.test(fname)) return false;
    return true;
  },

  isLNameValid: (lname) => {
    if (lname.length < 2) return false;
    if (/[!@#$%^&*()]/.test(lname)) return false;
    return true;
  },

  isEmailValid: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  isMobileValid: (mobile) => {
    const mobileRegex = /^[6-9]\d{9}$/;
    return mobileRegex.test(mobile);
  },

  isPasswordValid: (pass) => {
    if (pass.length < 6) return false;
    return true;
  },
};

module.exports = userValidations