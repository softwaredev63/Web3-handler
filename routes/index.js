const express = require("express");
const router = express.Router();

const wallet = require("../wallet");

const { encrypt } = require("../crypto");

/* GET home page. */
router.post("/get-wallet", function (req, res) {
  const pass = req.body.password;
  if (!pass) {
    res.status(400);
    res.send("Invalid data.");
    return;
  }

  const newWallet = wallet.generateWallet();

  const encryptedData = encrypt(newWallet.privateKey, pass);

  res.json({
    address: newWallet.address,
    privateKey: encryptedData.content,
    iv: encryptedData.iv,
  });
});

module.exports = router;
