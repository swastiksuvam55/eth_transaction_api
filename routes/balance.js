const express = require('express');
const axios = require('axios');
const Transaction = require('../models/Transaction');

const router = express.Router();

router.get('/:address', async (req, res) => {
  try {
    const address = req.params.address;
    const transactions = await Transaction.find({
      $or: [{ to: address }, { from: address }],
    });
    let balance = 0;
    transactions.forEach((transaction) => {
      if (transaction.to.toLowerCase() === address.toLowerCase()) {
        balance += parseInt(transaction.value);
      }
      if (transaction.from.toLowerCase() === address.toLowerCase()) {
        balance -= parseInt(transaction.value);
      }
    });
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr'
    );
    const data = response.data;
    const price = data.ethereum.inr;
    res.json({ balance, price });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
