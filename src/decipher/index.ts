import * as crypto from "crypto";
import { PathLike, createReadStream, createWriteStream } from "fs";
import { pipeline } from "stream";

// Función para cifrar un archivo usando el algoritmo AES-CBC
const decipher = ( 
  password: string, // Contraseña utilizada para el descifrado
  salt: string, //String para fortalecer la clave
  size: 128 | 192 | 256, // Tamaño de la clave en bits (128, 192 o 256)
  input: PathLike, // Ruta del archivo de entrada
  output: PathLike // Ruta del archivo de salida
) => {
  // Crea el descifrador AES-CBC con la clave derivada y un vector de inicialización aleatorio
  const decipher = crypto.createDecipheriv(
    `aes-${size}-cbc`, // Modo de operación (AES-CBC) y tamaño de clave
    crypto.scryptSync(password, salt, size / 8),
    new Uint8Array(16) // Vector de inicialización aleatorio
  );

  // Configura un pipeline para descifrar el archivo de entrada y escribirlo en el archivo de salida
  pipeline(
    createReadStream(input), // Lee el archivo cifrado
    decipher, // Descifra el contenido con AES-CBC
    createWriteStream(output), // Escribe el contenido descifrado
    // Manejar posibles errores
    (err) => {
      if (err) throw err;
    }
  );
};

export default decipher;
