import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';
import QRCode from 'qrcode';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;
let isReady = false;
let qrCodeData = null;
let qrImageBase64 = null;

// Recursively clean up stale Chromium Singleton lock files left over by container restarts
function removeChromiumLocks(dir) {
  if (!fs.existsSync(dir)) return;
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        removeChromiumLocks(fullPath);
      } else if (entry.name.startsWith('Singleton')) {
        try {
          fs.unlinkSync(fullPath);
          console.log(`🧹 Cleaned stale Chromium lock: ${entry.name}`);
        } catch (e) {
          // ignore error if file locked
        }
      }
    }
  } catch (err) {
    // ignore
  }
}

// Clean stale locks on startup
removeChromiumLocks('./.wwebjs_auth');

// Locate system installed Chrome or Edge executable on Windows/Linux
function findChromeExecutable() {
  const possiblePaths = [
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    (process.env.LOCALAPPDATA || '') + '\\Google\\Chrome\\Application\\chrome.exe'
  ];

  for (const p of possiblePaths) {
    if (p && fs.existsSync(p)) {
      console.log(`🔍 Found browser executable: ${p}`);
      return p;
    }
  }
  return undefined;
}

const chromePath = findChromeExecutable();

// Initialize WhatsApp Web client with LocalAuth (persists login QR scan)
const client = new Client({
  authStrategy: new LocalAuth({ dataPath: './.wwebjs_auth' }),
  puppeteer: {
    headless: true,
    executablePath: chromePath,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu',
      '--disable-extensions',
      '--disable-component-update',
      '--disable-default-apps',
      '--disable-background-networking',
      '--disable-sync'
    ]
  }
});

client.on('qr', async (qr) => {
  qrCodeData = qr;
  try {
    qrImageBase64 = await QRCode.toDataURL(qr, { margin: 2, width: 350 });
    console.log('✅ New QR Code generated successfully!');
  } catch (err) {
    console.error('Failed to generate QR image base64:', err);
  }

  console.log('\n======================================================');
  console.log('📱 SCAN THIS QR CODE WITH YOUR WHATSAPP (LINKED DEVICES)');
  console.log('👉 Or open HD QR page in browser: http://localhost:5000/qr');
  console.log('======================================================\n');
  qrcode.generate(qr, { small: false });
});

client.on('ready', () => {
  isReady = true;
  qrCodeData = null;
  qrImageBase64 = null;
  console.log('✅ WhatsApp Bot is Ready & Connected! Automated Background Receipts Active.');
});

client.on('authenticated', () => {
  console.log('🔐 WhatsApp Session Authenticated Successfully!');
});

client.on('auth_failure', (msg) => {
  console.error('❌ WhatsApp Auth Failure:', msg);
  isReady = false;
  // Wipe session on auth failure to force new QR
  try {
    fs.rmSync('./.wwebjs_auth', { recursive: true, force: true });
  } catch (e) {}
});

client.on('disconnected', (reason) => {
  console.log('⚠️ WhatsApp Disconnected:', reason);
  isReady = false;
  setTimeout(() => {
    try {
      client.initialize().catch(err => console.error('Re-init error:', err));
    } catch (e) {}
  }, 3000);
});

// Helper to format phone number
function formatWhatsAppPhone(phone) {
  if (!phone) return '';
  let digits = String(phone).replace(/\D/g, '');
  if (digits.length === 10) return `91${digits}`;
  if (digits.length === 11 && digits.startsWith('0')) return `91${digits.slice(1)}`;
  if (digits.length === 12 && digits.startsWith('91')) return digits;
  return digits;
}

// API Health / Status Endpoint
app.get('/api/status', (req, res) => {
  res.json({
    status: isReady ? 'connected' : 'connecting',
    isReady,
    qrAvailable: !!qrCodeData,
    qrImage: qrImageBase64
  });
});

// HTML HD QR Code View Endpoint
app.get('/qr', (req, res) => {
  if (isReady) {
    return res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>WhatsApp Bot - Connected</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #f0fdf4; color: #166534; }
            .card { background: white; padding: 2.5rem; border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.08); text-align: center; max-width: 400px; }
          </style>
        </head>
        <body>
          <div class="card">
            <h2 style="margin-top:0;">✅ WhatsApp Bot Connected!</h2>
            <p style="color: #475569; font-size: 14px;">Automated background receipt delivery is active and ready.</p>
          </div>
        </body>
      </html>
    `);
  }

  if (!qrImageBase64) {
    return res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>WhatsApp Bot - Initializing</title>
          <meta http-equiv="refresh" content="3">
          <style>
            body { font-family: sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #f8fafc; color: #334155; }
          </style>
        </head>
        <body>
          <div style="text-align: center">
            <h2>⏳ Generating WhatsApp QR Code...</h2>
            <p style="font-size: 13px; color: #64748b;">Please wait a few seconds. Page auto-refreshes.</p>
          </div>
        </body>
      </html>
    `);
  }

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Scan WhatsApp QR Code</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #0f172a; color: white; }
          .container { background: white; color: #0f172a; padding: 2rem; border-radius: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.4); text-align: center; max-width: 380px; width: 90%; }
          img { width: 100%; max-width: 320px; height: auto; border-radius: 16px; margin: 1.2rem 0; border: 4px solid #f1f5f9; }
          .badge { background: #2563eb; color: white; padding: 4px 14px; border-radius: 20px; font-size: 12px; font-weight: bold; letter-spacing: 0.5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <span class="badge">Ganesh Utsav WhatsApp Bot</span>
          <h2 style="margin-top: 12px; margin-bottom: 4px; font-size: 20px;">Scan QR Code</h2>
          <p style="font-size: 13px; color: #64748b; margin-top: 0;">Open WhatsApp on phone → Linked Devices → Link a Device</p>
          <img src="${qrImageBase64}" alt="WhatsApp QR Code" />
          <p style="font-size: 12px; color: #94a3b8; margin-bottom: 0;">This page auto-refreshes when scanned</p>
        </div>
        <script>
          setInterval(() => {
            fetch('/api/status').then(r => r.json()).then(d => {
              if (d.isReady) window.location.reload();
            });
          }, 3000);
        </script>
      </body>
    </html>
  `);
});

// Endpoint to send WhatsApp Receipt automatically in background
app.post('/api/send-receipt', async (req, res) => {
  const { phone, donorName, amount, receiptNo, paymentMode, collectorName, houseNo } = req.body;

  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  if (!isReady) {
    return res.status(503).json({ 
      error: 'WhatsApp Bot is still connecting or waiting for QR scan.',
      isReady: false 
    });
  }

  try {
    const formattedPhone = formatWhatsAppPhone(phone);
    const chatId = `${formattedPhone}@c.us`;

    const formattedDate = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    const messageText = `🪔 *SRI GANESH UTSAV SAMITHI* 🪔\n` +
      `*Official Digital Receipt*\n\n` +
      `*Receipt No:* ${receiptNo}\n` +
      `*Donor Name:* ${donorName}\n` +
      `*Address/Flat:* ${houseNo || 'N/A'}\n` +
      `*Amount Received:* ₹${Number(amount).toLocaleString('en-IN')}\n` +
      `*Payment Mode:* ${paymentMode}\n` +
      `*Collected By:* ${collectorName || 'Chanda Team'}\n` +
      `*Date:* ${formattedDate}\n\n` +
      `🙏 *Thank you for your generous contribution! May Lord Ganesha bless you and your family!* 🪔`;

    await client.sendMessage(chatId, messageText);

    console.log(`✅ Background WhatsApp Receipt sent successfully to +${formattedPhone} (Receipt #${receiptNo})`);
    return res.json({ success: true, receiptNo, phone: formattedPhone });

  } catch (error) {
    console.error('❌ Failed to send WhatsApp background message:', error);
    return res.status(500).json({ error: 'Failed to send message via WhatsApp Bot', details: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Automated Background WhatsApp Bot API running on http://localhost:${PORT}`);
  console.log(`👉 View HD QR Code in Browser: http://localhost:5000/qr`);
  console.log('Initializing WhatsApp Web Client...');
  removeChromiumLocks('./.wwebjs_auth');
  client.initialize().catch(err => {
    console.error('❌ WhatsApp initialize error:', err?.message || err);
  });
});
