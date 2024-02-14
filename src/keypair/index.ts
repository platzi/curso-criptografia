import * as crypto from "crypto";
import { PathLike, mkdirSync, writeFileSync } from "fs";
import { join } from "path";

const keygen = (
  type: "rsa" | "rsa-pss",
  size: 128 | 192 | 256,
  passphrase: string,
  format: "pem" | "der",
  modulusLength: 2048 | 3072 | 4096
) => {
  switch (type) {
    case "rsa": {
      const options: crypto.RSAKeyPairOptions<
        crypto.KeyFormat,
        crypto.KeyFormat
      > = {
        modulusLength,
        publicKeyEncoding: {
          type: "spki",
          format,
        },
        privateKeyEncoding: {
          type: "pkcs8",
          format,
          cipher: `aes-${size}-cbc`,
          passphrase,
        },
      };
      return crypto.generateKeyPairSync("rsa", options);
    }
    case "rsa-pss": {
      const options: crypto.RSAPSSKeyPairOptions<
        crypto.KeyFormat,
        crypto.KeyFormat
      > = {
        modulusLength,
        publicKeyEncoding: {
          type: "spki",
          format,
        },
        privateKeyEncoding: {
          type: "pkcs8",
          format,
          cipher: `aes-${size}-cbc`,
          passphrase,
        },
      };
      return crypto.generateKeyPairSync("rsa-pss", options);
    }
  }
};

const keypair = (
  type: "rsa" | "rsa-pss",
  size: 128 | 192 | 256,
  passphrase: string,
  outDir: string,
  outFormat: "pem" | "der",
  modulusLength: 2048 | 3072 | 4096
) => {
  const { publicKey, privateKey } = keygen(
    type,
    size,
    passphrase,
    outFormat,
    modulusLength
  );
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, `public.${outFormat}`), publicKey.toString());
  writeFileSync(join(outDir, `private.${outFormat}`), privateKey.toString());
};

export default keypair;
