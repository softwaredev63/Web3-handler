require("dotenv").config();
const AWS = require("aws-sdk");

const kms = new AWS.KMS({
  accessKeyId: process.env.API_KEY,
  secretAccessKey: process.env.SECRET_KEY,
  region: process.env.AWS_REGION,
});

function decryptKMS(encrypted, accessKeyId, secretAccessKey) {
  let kmsDecryptor = kms;
  if (accessKeyId && secretAccessKey) {
    kmsDecryptor = new AWS.KMS({
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
      region: process.env.AWS_REGION,
    });
  }

  return new Promise((resolve, reject) => {
    kmsDecryptor.decrypt(
      {
        KeyId: process.env.ENCRYPT_KEY_ID,
        CiphertextBlob: Buffer.from(encrypted, "base64"),
      },
      (err, data) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          const decrypted = data.Plaintext.toString("ascii");
          console.log('Successfully decrypted with KMS');
          resolve(decrypted);
        }
      }
    );
  });
}

function encryptAndStoreToKMS(privateKey) {
  const params = {
    KeyId: process.env.ENCRYPT_KEY_ID,
    Plaintext: Buffer.from(privateKey, "ascii"),
  };

  return new Promise((resolve, reject) => {
    kms.encrypt(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        const encrypted = data.CiphertextBlob.toString("base64");

        resolve(encrypted);
      }
    });
  });
}

module.exports = {
  encryptAndStoreToKMS,
  decryptKMS
};
