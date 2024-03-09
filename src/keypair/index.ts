// Importa módulos necesarios
import * as crypto from "crypto";
import { PathLike, mkdirSync, writeFileSync } from "fs";
import { join } from "path";

// Función para generar un par de claves RSA o RSA-PSS
const keygen = (
  // Tipo de clave a generar ("rsa" o "rsa-pss")
  type: "rsa" | "rsa-pss",
  // Tamaño de cifrado para la clave privada (128, 192 o 256 bits)
  size: 128 | 192 | 256,
  // Frase de contraseña para proteger la clave privada
  passphrase: string,
  // Formato de salida de las claves ("pem" o "der")
  format: "pem" | "der",
  // Longitud del módulo para la clave (2048, 3072 o 4096 bits)
  modulusLength: 2048 | 3072 | 4096
  // Define las opciones de generación de claves según el tipo
) => {
  switch (type) {
    case "rsa": {
      // Opciones para claves RSA
      const options: crypto.RSAKeyPairOptions<
        crypto.KeyFormat,
        crypto.KeyFormat
      > = {
        modulusLength, // Longitud del módulo
        publicKeyEncoding: {
          type: "spki", // Formato estándar para clave pública
          format, // Formato de salida
        },
        privateKeyEncoding: {
          type: "pkcs8", // Formato estándar para clave privada
          format, // Formato de salida
          cipher: `aes-${size}-cbc`, // Algoritmo de cifrado para la clave privada
          passphrase, // Frase de contraseña
        },
      };
      return crypto.generateKeyPairSync("rsa", options); // Genera el par de claves
    }
    case "rsa-pss": {
      // Opciones para claves RSA-PSS (similar a RSA pero con firma PSS)
      const options: crypto.RSAPSSKeyPairOptions<
        crypto.KeyFormat,
        crypto.KeyFormat
      > = {
        modulusLength, // Longitud del módulo
        publicKeyEncoding: {
          type: "spki", // Formato estándar para clave pública
          format, // Formato de salida
        },
        privateKeyEncoding: {
          type: "pkcs8", // Formato estándar para clave privada
          format, // Formato de salida
          cipher: `aes-${size}-cbc`, // Algoritmo de cifrado para la clave privada
          passphrase, // Frase de contraseña
        },
      };
      return crypto.generateKeyPairSync("rsa-pss", options);  // Genera el par de claves
    }
  }
};

// Función para crear un par de claves y guardarlas en archivos
const keypair = (
  type: "rsa" | "rsa-pss",
  size: 128 | 192 | 256,
  passphrase: string,
  outDir: string,
  outFormat: "pem" | "der",
  modulusLength: 2048 | 3072 | 4096
) => {
  // Genera el par de claves usando la función keygen
  const { publicKey, privateKey } = keygen(
    type,
    size,
    passphrase,
    outFormat,
    modulusLength
  );
  // Crea la carpeta de salida si no existe
  mkdirSync(outDir, { recursive: true });
  // Guarda la clave pública en un archivo
  writeFileSync(join(outDir, `public.${outFormat}`), publicKey.toString());
  // Guarda la clave privada en un archivo (cifrada con la frase de contraseña)
  writeFileSync(join(outDir, `private.${outFormat}`), privateKey.toString());
};

// Exporta la función keypair para usarla en otros módulos
export default keypair;
