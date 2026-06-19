import crypto from "crypto";

export const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
