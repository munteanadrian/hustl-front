function validateEmail(email) {
  errors = [];
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("Invalid format, please use example@email.com");
  }

  return errors;
}

function validatePassword(password) {
  errors = [];

  if (password !== "" && password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  } else if (!/[a-z]/.test(password)) {
    errors.push("Password must have at least one lowercase letter");
  } else if (!/[A-Z]/.test(password)) {
    errors.push("Password must have at least one capital letter");
  } else if (!/\d/.test(password)) {
    errors.push("Password must have at least one number");
  }

  return errors;
}

function validateName(name) {
  errors = [];

  if (name !== "" && name.length < 2) {
    errors.push("Name must be at least 2 characters long");
  } else if (!/^[a-zA-Z\s'-]*$/.test(name)) {
    errors.push(
      "Name must only contain letters, spaces, dashes, and apostrophes"
    );
  }

  return errors;
}

function validate(inputType, input) {
  errors = [];

  if (inputType === "email") {
    errors = validateEmail(input);
  } else if (inputType === "password") {
    errors = validatePassword(input);
  } else if (inputType === "name") {
    errors = validateName(input);
  }

  return errors;
}

export default validate;
