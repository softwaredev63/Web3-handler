const express = require("express");
const router = express.Router();

const wallet = require("../wallet");
const kms = require("../kms");

const { encrypt, decrypt } = require("../crypto");

/* POST Private key decryptor using KMS. */
router.post("/retrieve-kms-key", async (req, res) => {
  const { accessKeyId, secretAccessKey, encryptedData } = req.body;
  if (!encryptedData) {
    res.status(400);
    res.send("Invalid data.");
    return;
  }

  const decrypted = await kms.decryptKMS(encryptedData, accessKeyId, secretAccessKey);

  res.json({
    privateKey: decrypted,
  });
});

/* POST Private key decryptor. */
router.post("/decrypt-key", async (req, res) => {
  const { password: pass, iv, privateKey } = req.body;
  if (!pass || !iv || !privateKey) {
    res.status(400);
    res.send("Invalid data.");
    return;
  }

  const decrypted = decrypt(privateKey, pass, iv);

  res.json({
    privateKey: decrypted,
  });
});

/* POST Wallet creator. */
router.post("/get-wallet", async (req, res) => {
  const { password: pass } = req.body;
  if (!pass) {
    res.status(400);
    res.send("Invalid data.");
    return;
  }

  const newWallet = await wallet.generateWallet();

  const kmsEncrypted = await kms.encryptAndStoreToKMS(newWallet.privateKey);

  const encryptedData = encrypt(newWallet.privateKey, pass);

  res.json({
    address: newWallet.address,
    privateKey: encryptedData.content,
    iv: encryptedData.iv,
    doubleEncrypted: kmsEncrypted,
  });
});

/* POST Private key encrypto. */
router.post("/encrypt-key", async (req, res) => {
  const { password: pass, privateKey } = req.body;
  if (!pass || !privateKey) {
    res.status(400);
    res.send("Invalid data.");
    return;
  }

  const encryptedData = encrypt(privateKey, pass);

  res.json({
    privateKey: encryptedData.content,
    iv: encryptedData.iv,
  });
});

/* POST Send tokens to user*/
router.post("/send-token", async (req, res) => {
  const { sender_private_key, address, amount, gas } = req.body;
  if (!sender_private_key || !address || !amount || !gas) {
    res.status(400);
    res.send("Invalid data.");
    return;
  }

  const transaction = await wallet.sendTokenToUser(
    sender_private_key,
    address,
    amount,
    gas
  );

  res.json(transaction);
});

router.get("/elb-status", (req, res) => {
  res.json({ everything: "OK" });
});

router.post("/get-balance", async (req, res) => {
  const { sender_address } = req.body;
  if (!sender_address) {
    res.status(400);
    res.send("Invalid data.");
    return;
  }

  const balanceInfo = await wallet.getUserBalance(sender_address);
  res.json(balanceInfo);
});

module.exports = router;
