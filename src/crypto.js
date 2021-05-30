const crypto = require("crypto");

const algorithm = "aes-256-ctr";

const encrypt = (text, password) => {
  const iv = Buffer.from(crypto.randomBytes(8), "hex").toString("hex");
  const secretKey = crypto.createHash("md5").update(password).digest("hex");

  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  return {
    iv: iv,
    content: encrypted.toString("hex"),
  };
};

module.exports = {
  encrypt,
};
