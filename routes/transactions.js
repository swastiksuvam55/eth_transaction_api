const express = require('express');
const axios = require('axios');
const Transaction = require('../models/Transaction');

const router = express.Router();

router.get('/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const response = await axios.get(
      `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${process.env.ETHERSCAN_API_KEY}`
    );
    const transactions = response.data.result.filter(
      (tx) => tx.isError === '0' && tx.txreceipt_status === '1' && tx.value !== '0'
    );
    const savedTransactions = await Transaction.insertMany(transactions);
    res.json(savedTransactions);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching transactions');
  }
});

module.exports = router;
