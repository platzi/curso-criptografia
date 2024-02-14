import * as crypto from "crypto";
import { PathLike, readFileSync } from "fs";

const verify = (
  algorithm: "RSA-SHA256",
  input: PathLike,
  publicKey: PathLike,
  signature: string, // Encoded (hex),
  signatureEncoding: crypto.BinaryToTextEncoding
) => {
  const verify = crypto.createVerify(algorithm);
  verify.update(readFileSync(input));
  verify.end();
  return verify.verify(readFileSync(publicKey), signature, signatureEncoding);
};

export default verify;
