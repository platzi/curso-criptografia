import * as crypto from "crypto";
import { PathLike, readFileSync } from "fs";

const verify = (
   // Algoritmo de firma utilizado para la verificación (mismo que en la firma)
  algorithm: "RSA-SHA256",
  // Ruta al archivo que se va a verificar
  input: PathLike,
  // Ruta al archivo que contiene la clave pública
  publicKey: PathLike,
  // Firma a verificar (codificada en hexadecimal)
  signature: string,
   // Codificación de la firma
  signatureEncoding: crypto.BinaryToTextEncoding
) => {
  // Crea un objeto de verificación del tipo especificado
  const verify = crypto.createVerify(algorithm);
  // Actualiza el objeto de verificación con el contenido del archivo a verificar
  verify.update(readFileSync(input));
  // Finaliza la actualización del objeto de verificación
  verify.end();
  // Verifica la firma usando la clave pública, la firma y su codificación
  return verify.verify(readFileSync(publicKey), signature, signatureEncoding);
};
// Exporta la función verify
export default verify;
