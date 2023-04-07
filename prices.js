const CronJob = require('cron').CronJob;
const axios = require('axios');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB');
});

// Schema and model for prices
const priceSchema = new mongoose.Schema({
  price: Number,
  timestamp: Number,
});

const Price = mongoose.model('Price', priceSchema);

// cron job to fetch price every 10 minutes
new CronJob('0 */1 * * * *', async function() {
  try {
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr'
    );
    const price = response.data.ethereum.inr;
    const timestamp = new Date().getTime();
    const savedPrice = await Price.create({ price, timestamp });
    console.log(`Saved price: ${savedPrice.price} at ${new Date(savedPrice.timestamp)}`);
  } catch (error) {
    console.error(error);
  }
}, null, true, 'Asia/Kolkata');
