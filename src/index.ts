import yargs from "yargs";
import prng from "./prng";
import cipher from "./cipher";
import decipher from "./decipher";
import { scrypt } from "crypto";
import hash from "./hash";
import hmac from "./hmac";
import diffieHellman from "./diffie-hellman";
import keypair from "./keypair";
import sign from "./sign";
import verify from "./verify";

const encoding = {
  alias: "enc",
  choices: [
    "ascii",
    "utf8",
    "utf-8",
    "utf16le",
    "utf-16le",
    "ucs2",
    "ucs-2",
    "base64",
    "base64url",
    "latin1",
    "binary",
    "hex",
  ] as const,
  default: "hex",
} as const;

const input = {
  alias: "i",
  type: "string",
  demandOption: true,
} as const;

const output = {
  alias: "o",
  type: "string",
  demandOption: true,
} as const;

const { argv } = yargs
  .options({})
  .command({
    command: "prng",
    describe: "Generar un numero aleatrio",
    handler: ({ type, size, min, max, encoding }) => {
      console.log(prng(type, size, min, max, encoding));
    },
    builder: {
      type: {
        choices: ["bytes", "int", "uuid"] as const,
        description: "",
        demandOption: true,
      },
      size: {
        alias: "s",
        description: "Tamaño de la aleatoried",
        default: 16,
      },
      min: {
        type: "number",
        default: 0,
      },
      max: {
        type: "number",
        default: 100,
      },
    },
  })
  .command({
    command: "cipher",
    describe: "Encrypt a file",
    handler: ({ password, salt, size, input, output }) => {
      cipher(password, salt, size, input, output);
    },
    builder: {
      password: {
        alias: "p",
        description: "The password to encrypt the file with",
        type: "string",
      },
      salt: {
        description: "The salt to encrypt the file with",
        type: "string",
      },
      size: {
        choices: [128, 192, 256] as const,
        description: "The size of the key",
        default: 128,
      },
      input: {
        ...input,
        description: "The file to encrypt",
      },
      output: {
        ...output,
        description: "The file to output the encrypted file to",
      },
    },
  })
  .command({
    command: "decipher",
    describe: "Decrypt a file",
    handler: ({ password, salt, size, input, output }) => {
      decipher(password, salt, size, input, output);
    },
    builder: {
      password: {
        alias: "p",
        description: "The password to decrypt the file with",
        type: "string",
      },
      salt: {
        description: "The salt to decrypt the file with",
        type: "string",
      },
      size: {
        choices: [128, 192, 256] as const,
        description: "The size of the key",
        default: 128,
      },
      input: {
        ...input,
        description: "The file to decrypt",
      },
      output: {
        ...output,
        description: "The file to output the decrypted file to",
      },
    },
  })
  .command({
    command: "scrypt",
    describe: "Generate a key from a password and salt",
    handler: ({ password, salt, size, encoding }) =>
      console.log(scrypt(password, salt, size, encoding)),
    builder: {
      password: {
        alias: "p",
        description: "The password to generate the key from",
        type: "string",
        demandOption: true,
      },
      salt: {
        description: "The salt to generate the key from",
        type: "string",
        demandOption: true,
      },
      size: {
        alias: "s",
        description: "The number of bytes to output",
        type: "number",
        default: 64,
      },
      encoding,
    },
  })
  .command({
    command: "hash",
    describe: "Hash a file",
    handler: ({ algorithm, encoding, input }) => {
      console.log(hash(algorithm, encoding, input));
    },
    builder: {
      algorithm: {
        alias: "a",
        description: "The algorithm to use",
        type: "string",
        demandOption: true,
        default: "sha256",
      },
      input: {
        ...input,
        description: "The file to hash",
      },
      encoding,
    },
  })
  .command({
    command: "hmac",
    describe: "Generate an HMAC for a file",
    handler: ({ algorithm, key, encoding, input }) => {
      console.log(hmac(algorithm, key, encoding, input));
    },
    builder: {
      algorithm: {
        alias: "a",
        description: "The algorithm to use",
        type: "string",
        default: "sha256",
      },
      input: {
        ...input,
        description: "The file to hmac",
      },
      key: {
        alias: "k",
        description: "The key to use",
        type: "string",
        demandOption: true,
      },
      encoding,
    },
  })
  .command({
    command: "diffie-hellman",
    describe:
      "Compute keys for diffie-hellman exchange or compute secret from keys if provided",
    aliases: ["dh"],
    handler: ({
      publicKey,
      publicKeyEncoding,
      encoding,
      prime,
      generator,
      primeEncoding,
      generatorEncoding,
      privateKey,
      privateKeyEncoding,
    }) => {
      console.log(
        diffieHellman(
          encoding,
          publicKey && {
            publicKey,
            publicKeyEncoding,
            prime,
            primeEncoding,
            generator,
            generatorEncoding,
            privateKey,
            privateKeyEncoding,
          }
        )
      );
    },
    builder: {
      publicKey: {
        alias: "pub",
        description: "The other's public key",
        type: "string",
        implies: [
          "publicKeyEncoding",
          "privateKey",
          "privateKeyEncoding",
          "prime",
          "primeEncoding",
          "generator",
          "generatorEncoding",
        ],
      },
      publicKeyEncoding: {
        ...encoding,
        alias: "pube",
        description: "Other's public key encoding",
        default: "hex",
      },
      privateKey: {
        alias: "priv",
        description: "Own private key",
        type: "string",
      },
      privateKeyEncoding: {
        ...encoding,
        alias: "prive",
        description: "Own private key encoding",
        default: "hex",
      },
      prime: {
        alias: "p",
        description: "The prime number",
        type: "string",
      },
      primeEncoding: {
        ...encoding,
        alias: "pe",
        description: "Prime number encoding",
        default: "hex",
      },
      generator: {
        alias: "g",
        description: "The generator",
        type: "string",
      },
      generatorEncoding: {
        ...encoding,
        alias: "ge",
        description: "Generator encoding",
        default: "hex",
      },
      encoding,
    },
  })
  .command({
    command: "keypair",
    describe: "Generate an assymetric key pair",
    handler: ({ type, size, passphrase, outDir, outFormat, modulusLength }) => {
      keypair(type, size, passphrase, outDir, outFormat, modulusLength);
    },
    builder: {
      type: {
        choices: ["rsa", "rsa-pss"] as const,
        description: "The type of key pair to generate",
        demandOption: true,
      },
      size: {
        choices: [128, 192, 256] as const,
        description: "The size of the passphrase",
        default: 128,
      },
      passphrase: {
        alias: "p",
        description: "The passphrase to encrypt the private key with",
        type: "string",
        demandOption: true,
      },
      outDir: {
        alias: "o",
        description: "The directory to output the keys to",
        type: "string",
        default: "./.secrets",
      },
      outFormat: {
        alias: "f",
        description: "The format to output the keys in",
        choices: ["pem", "der"] as const,
        default: "pem",
      },
      modulusLength: {
        alias: "m",
        description: "The modulus length",
        choices: [2048, 3072, 4096] as const,
        default: 2048,
      },
    },
  })
  .command({
    command: "sign",
    describe: "Sign a file",
    handler: ({ algorithm, input, privateKey, encoding, passphrase }) => {
      console.log(sign(algorithm, input, privateKey, encoding, passphrase));
    },
    builder: {
      algorithm: {
        alias: "a",
        description: "The algorithm to use",
        type: "string",
        default: "RSA-SHA256",
      },
      input: { ...input, description: "The file to sign" },
      privateKey: {
        ...input,
        alias: "priv",
        description: "The private key to sign with",
      },
      encoding,
      passphrase: {
        alias: "p",
        description: "The passphrase to decrypt the private key",
        type: "string",
      },
    },
  })
  .command({
    command: "verify",
    describe: "Verify a signature for a given file",
    handler: ({
      algorithm,
      input,
      publicKey,
      signature,
      signatureEncoding,
    }) => {
      console.log(
        verify(algorithm, input, publicKey, signature, signatureEncoding)
      );
    },
    builder: {
      algorithm: {
        alias: "a",
        description: "The algorithm to use",
        type: "string",
        default: "RSA-SHA256",
      },
      input: { ...input, description: "The file to verify" },
      publicKey: {
        ...input,
        alias: "pub",
        description: "The public key to verify against",
      },
      signature: {
        alias: "s",
        description: "The signature to verify",
        type: "string",
        demandOption: true,
      },
      signatureEncoding: {
        ...input,
        alias: "se",
        description: "The signature encoding",
        default: "hex",
      },
    },
  })
  .demandCommand(1, "You need at least one command before moving on")
  .help();

// console.log(argv);
