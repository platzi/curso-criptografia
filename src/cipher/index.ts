import * as crypto from "crypto";
import { PathLike, createReadStream, createWriteStream } from "fs";
import { pipeline } from "stream";

// Función para cifrar un archivo usando el algoritmo AES-CBC
const cipher = (
  password: string, // Contraseña para la clave de cifrado
  salt: string, //String para fortalecer la clave
  size: 128 | 192 | 256, // Tamaño de la clave en bits (128, 192 o 256)
  input: PathLike, // Ruta del archivo de entrada
  output: PathLike // Ruta del archivo de salida
) => {
   // Crear un cifrador AES-CBC
  const cipher = crypto.createCipheriv(
    `aes-${size}-cbc`, // Algoritmo AES en modo CBC
    crypto.scryptSync(password, salt, size / 8),
     // Vector de inicialización (IV) de 16 bytes
    new Uint8Array(16)
  );

  // Cifrar el archivo de entrada y escribir el resultado en el archivo de salida
  pipeline(
    // Crear un flujo de lectura del archivo de entrada
    createReadStream(input),
    // Cifrar los datos del flujo
    cipher,
    // Crear un flujo de escritura para el archivo de salida
    createWriteStream(output),
    // Maneja posibles errores
    (err) => {
      if (err) throw err;
    }
  );
};

export default cipher;
