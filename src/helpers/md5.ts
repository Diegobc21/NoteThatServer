import crypto from "crypto";

const encryptPassword = (password: string) => {
  // Creamos un objeto de hash MD5
  const md5 = crypto.createHash("md5");

  // Actualizamos el objeto de hash con la contraseña
  md5.update(password);

  // Devolvemos el hash en formato hexadecimal
  return md5.digest("hex");
};

export default encryptPassword;
