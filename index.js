const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
app.use(express.json());

app.post('/', async (req, res) => {
  const { jobUrl } = req.body;
  if (!jobUrl) return res.status(400).send('Missing job URL');

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(jobUrl, { waitUntil: 'networkidle2' });
    console.log("Visited:", jobUrl);
    await page.waitForTimeout(2000);

    await browser.close();
    res.send({ success: true, message: 'Job page visited.' });
  } catch (err) {
    await browser.close();
    res.status(500).send({ success: false, error: err.toString() });
  }
});

app.listen(3000, () => console.log('Bot running on port 3000'));


