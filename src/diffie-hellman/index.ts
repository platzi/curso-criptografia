// Importa la biblioteca crypto para funciones
import * as crypto from "crypto";

const diffieHellman = (
  // Define la codificación a usar para convertir datos binarios a texto
  encoding: crypto.BinaryToTextEncoding,
  // Parámetros para inicializar Diffie-Hellman a partir de valores conocidos
  from?: {
    prime: string;
    primeEncoding: crypto.BinaryToTextEncoding;
    generator: string;
    generatorEncoding: crypto.BinaryToTextEncoding;
    publicKey: string;
    publicKeyEncoding: crypto.BinaryToTextEncoding;
    privateKey: string;
    privateKeyEncoding: crypto.BinaryToTextEncoding;
  }
) => {
   // Si no se proporcionan parámetros, inicia el intercambio Diffie-Hellman
  if (!from) {
    // Crea un nuevo grupo Diffie-Hellman con seguridad de 128 bits
    const dh = crypto.createDiffieHellmanGroup("modp14");
    // Genera las claves pública y privada
    const publicKey = dh.generateKeys();

    // Devuelve los parámetros necesarios para compartir con la otra parte:
    return {
      prime: dh.getPrime().toString(encoding), // Número primo en formato string
      generator: dh.getGenerator().toString(encoding), // Generador en formato string
      publicKey: publicKey.toString(encoding), // Clave pública en formato string
      privateKey: dh.getPrivateKey().toString(encoding), // Clave privada NO compartir!
    };
  } else {
    // Si se proporcionan los parámetros, continua el intercambio
    const dh = crypto.createDiffieHellman(
      from.prime,
      from.primeEncoding,
      from.generator,
      from.generatorEncoding
    );

    // Establece las claves privada y pública recibidas
    dh.setPrivateKey(from.privateKey, from.privateKeyEncoding);
    dh.setPublicKey(from.publicKey, from.publicKeyEncoding);

    // Calcula la clave secreta compartida
    const secret = dh.computeSecret(from.publicKey, from.publicKeyEncoding);

    // Devuelve los parámetros, incluyendo la clave secreta:
    return {
      prime: dh.getPrime().toString(encoding),
      generator: dh.getGenerator().toString(encoding),
      publicKey: dh.getPublicKey().toString(encoding),
      privateKey: dh.getPrivateKey().toString(encoding), // Clave privada NO compartir!
      secret: secret.toString(encoding), // Clave secreta compartida
    };
  }
};

// Exporta la función 
export default diffieHellman;
