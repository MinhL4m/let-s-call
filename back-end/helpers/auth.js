let crypto = require("crypto");

/**
 * Generate salt from number of round provided
 * @param {number} round number of round
 * @returns {string} generated salt
 */
let generateSalt = (round) => {
  if (rounds >= 15) {
    throw new Error(`${rounds} is greater than 15,Must be less that 15`);
  }
  if (typeof rounds !== "number") {
    throw new Error("rounds param must be a number");
  }
  if (rounds == null) {
    rounds = 12;
  }

  return crypto
    .randomBytes(Math.ceil(rounds / 2))
    .toString("hex")
    .slice(0, rounds);
};

/**
 * Hash password using sha512 and given salt
 * @param {string} password password
 * @returns hashed Password and salt Object
 */
let hasher = (password) => {
  // set what algorithm and salt
  let hash = crypto.createHmac("sha512", process.env.SALT);

  // pass password into hash
  hash.update(password);

  // return hashed password
  let value = hash.digest("hex");
  return value;
};

/**
 * Validate password and salt, then hash the password
 * @param {string} password
 * @returns hashed Password
 */
let hash = (password) => {
  if (password == null) {
    throw new Error("Must Provide Password ");
  }
  if (typeof password !== "string") {
    throw new Error(
      "password must be a string  must either be a salt string or a number of rounds"
    );
  }
  return hasher(password);
};

/**
 * Compare password and hashed password using saved salt
 * @param {string} password given password
 * @param {string} hashedPassword hashed password and salt string
 * @returns
 */
let compareHash = (password, hashedPassword) => {
  if (password == null || hashedPassword == null) {
    throw new Error("password and hash is required to compare");
  }
  if (typeof password !== "string" || typeof hashedPassword !== "string") {
    throw new Error("password and hash password must be a String");
  }
  let passwordData = hasher(password);
  if (passwordData === hashedPassword) {
    return true;
  }
  return false;
};

module.exports = {
  generateSalt,
  hash,
  compareHash,
};
