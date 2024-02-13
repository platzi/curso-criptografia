import * as crypto from "crypto";

const scrypt = (
  password: string,
  salt: string,
  size: number,
  encoding: BufferEncoding
) => {
  return crypto.scryptSync(password, salt, size).toString(encoding);
};

export default scrypt;
