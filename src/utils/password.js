import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(SALT_ROUNDS));

export const isValidPassword = (password, hashedPassword) =>
  bcrypt.compareSync(password, hashedPassword);

