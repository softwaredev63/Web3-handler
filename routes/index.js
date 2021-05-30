const express = require("express");
const router = express.Router();

const wallet = require("../wallet");

const { encrypt } = require("../crypto");

/* POST Wallet creator. */
router.post("/get-wallet", async (req, res) => {
  const {password: pass} = req.body;
  if (!pass) {
    res.status(400);
    res.send("Invalid data.");
    return;
  }

  const newWallet = await wallet.generateWallet();

  const encryptedData = encrypt(newWallet.privateKey, pass);

  res.json({
    address: newWallet.address,
    privateKey: encryptedData.content,
    iv: encryptedData.iv,
  });
});

/* POST Send tokens to user*/
router.post("/send-token", async (req, res) => {
  const {sender_private_key, address, amount} = req.body;
  if (!sender_private_key || !address || !amount) {
    res.status(400);
    res.send("Invalid data.");
    return;
  }

  const transaction = await wallet.sendTokenToUser(sender_private_key, address, amount);

  res.json(transaction);
});

module.exports = router;
