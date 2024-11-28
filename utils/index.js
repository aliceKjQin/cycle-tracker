export const gradients = {
  indigo: [
    "#dcd6ff",
    "#b8adff",
    "#9285ff",
    "#7766ff",
    "#4833ff",
    "#3525db",
    "#261ab1",
    "#1a1093",
    "#10097a",
  ],
  green: [
    "#dcfdc3",
    "#affc9d",
    "#7cf86c",
    "#4bf246",
    "#0cea1c",
    "#0dc928",
    "#0ca82f",
    "#038731",
    "#047031",
  ],
  blue: [
    "#ccfffa",
    "#9afefe",
    "#66f1fc",
    "#41dffa",
    "#07c2f7",
    "#0497d4",
    "#0171b1",
    "#02518e",
    "#003a76",
  ],
  yellow: [
    "#fff8db",
    "#fff0b8",
    "#ffe495",
    "#ffd97b",
    "#ffc84f",
    "#dba339",
    "#b78127",
    "#936118",
    "#7a4b10",
  ],
  pink: [
    "#ffd8f2",
    "#ffb1ea",
    "#ff8aea",
    "#ff6df1",
    "#ff3dfe",
    "#cd2ddb",
    "#9d1fb7",
    "#731493",
    "#540b7a",
  ],
  colorCombo: ["#a3a3a3", "#f87171", "#2dd4bf"],
};

export const baseRating = {
  "0": {"mood": 2},
  "1": {"mood": 3},
  "2": {"mood": 3},
  "3": {"mood": 3},
  "4": {"mood": 3},
  "5": {"mood": 3, "note": "Feeling tired"},
  "6": {"mood": 3},
  "7": {"mood": 3},
  "8": {"mood": 2},
  "9": {"mood": 1, "note": "feeling tired", "period": true},
  "10": {"mood": 1, "note": "feeling tired", "period": true},
  "11": {"mood": 1, "period": true},
  "12": {"mood": 1, "period": true},
  "13": {"mood": 1, "note": "feeling tired", "period": true},
  "14": {"mood": 3},
  "15": {"mood": 3},
  "16": {"mood": 3, "note": "Great day!"},
  "17": {"mood": 3, "note": "Productive work"},
  "18": {"mood": 3},
  "19": {"mood": 3},
  "20": {"mood": 3},
  "21": {"mood": 3},
  "22": {"mood": 3},
  "23": {"mood": 3},
  "24": {"mood": 3},
  "25": {"mood": 2, "note": "Productive work"},
  "26": {"mood": 1},
  "27": {"mood": 3},
  "28": {"mood": 2},
  "29": {"mood": 1},
  "30": {"mood": 3},
  "31": {"mood": 2},
  "32": {"mood": 1},
  "33": {"mood": 3},
  "34": {"mood": 2},
  "35": {"mood": 1},
  "36": {"mood": 3},
  "37": {"mood": 2},
  "38": {"mood": 1, "note": "Feeling tired"},
  "39": {"mood": 3},
  "40": {"mood": 1},
  "41": {"mood": 2},
  "42": {"mood": 3},
  "43": {"mood": 1}
};


export const validateEmail = (email) => {
  const maxLength = 254;
  const trimmedEmail = email.trim();

  const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i;


  if (trimmedEmail.length > maxLength) {
    return {
      valid: false,
      message: `Email exceeds maximum length of ${maxLength} characters.`,
    };
  }

  // Check the overall structure
  if (!emailRegex.test(trimmedEmail)) {
    return { valid: false, message: "Invalid email format." };
  }

  return { valid: true };
};

export const validatePassword = (password) => {
  const minLength = 8;
  const maxLength = 64; // Optional, based on app's needs.
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasSpace = /\s/.test(password);

  if (password.length < minLength) {
    return { valid: false, message: `Password must be at least ${minLength} characters long.` };
  }

  if (password.length > maxLength) {
    return { valid: false, message: `Password must be no more than ${maxLength} characters long.` };
  }

  if (!hasUpperCase) {
    return { valid: false, message: "Password must include at least one uppercase letter." };
  }

  if (!hasLowerCase) {
    return { valid: false, message: "Password must include at least one lowercase letter." };
  }

  if (!hasNumber) {
    return { valid: false, message: "Password must include at least one number." };
  }

  if (!hasSpecialChar) {
    return { valid: false, message: "Password must include at least one special character i.e.,!@#." };
  }

  if (hasSpace) {
    return { valid: false, message: "Password cannot contain spaces." };
  }

  return { valid: true, message: null };
};


// Validation function for the note input in NoteModal
export const validateNoteInput = (input) => {
  const trimmedInput = input.trim();
  // Define valid letters, numbers, spaces, punctuation, symbols and emojis
  const validNoteRegex = /^[a-zA-Z0-9\s.,;!?()'"*\-:\[\]@&%#^_+=|~`$^]*$/;
  const emojiRegex =
    /[\uD83C-\uDBFF\uDC00-\uDFFF\u2600-\u26FF\u2700-\u27BF\u2B50\u231A\u1F004-\u1F0CF]/;

  // Check input exceeds 500 characters
  if (trimmedInput.length > 500) {
    return { valid: false, message: "Exceeds the 500 characters limit." };
  }

  //Check for forbidden characters (angle brackets and curly braces)
  if (/[<>{}]/.test(trimmedInput)) {
    return { valid: false, message: "<> and {} are not allowed." };
  }

  // Check for valid characters (letters, numbers, spaces, symbols, punctuation, emojis)
  if (!validNoteRegex.test(trimmedInput) && !emojiRegex.test(trimmedInput)) {
    return {
      valid: false,
      message:
        "Please enter a valid note. Only letters, numbers, spaces, emojis, common punctuation and symbols are allowed.",
    };
  }

  return { valid: true }; // Valid input
};
