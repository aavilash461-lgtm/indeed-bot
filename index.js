const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
app.use(express.json());

// Define a root route for GET requests to show that the bot is live
app.get('/', (req, res) => {
  res.send('Bot is live!');  // You can customize this message
});

// Existing POST route to handle job applications
app.post('/', async (req, res) => {
  const { jobUrl } = req.body;
  if (!jobUrl) return res.status(400).send('Missing job URL');

  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();

  try {
    await page.goto(jobUrl, { waitUntil: 'networkidle2' });
    console.log("Job page loaded:", jobUrl);

    await browser.close();
    res.send({ success: true, message: 'Job page visited.' });
  } catch (err) {
    await browser.close();
    res.status(500).send({ success: false, error: err.toString() });
  }
});

// Start the server on port 3000
app.listen(3000, () => console.log('Bot running on port 3000'));
