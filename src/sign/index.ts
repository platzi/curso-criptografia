// Importa los módulos necesarios
import * as crypto from "crypto";
import { PathLike, readFileSync } from "fs";

const sign = (
   // Algoritmo de firma a usar (en este caso, "RSA-SHA256")
  algorithm: "RSA-SHA256",
  // Ruta al archivo que se va a firmar
  input: PathLike,
  // Ruta al archivo que contiene la clave privada
  privateKey: PathLike,
   // Codificación para la firma resultante 
  encoding: BufferEncoding,
  // Frase de contraseña para descifrar la clave privada
  passphrase: string
) => {
  // Crea un objeto de firma del tipo especificado
  const sign = crypto.createSign(algorithm);
  // Actualiza el objeto de firma con el contenido del archivo a firmar
  sign.update(readFileSync(input));
  // Finaliza la actualización del objeto de firma
  sign.end();
  // Genera la firma usando la clave privada y la frase de contraseña
  return sign
    .sign({
      key: readFileSync(privateKey), // Lee la clave privada del archivo
      passphrase, // Proporciona la frase de contraseña
    })
    .toString(encoding); // Convierte la firma a la codificación especificada
};
// Exporta la función sign
export default sign;