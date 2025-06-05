const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3100;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// 🪞 Log all incoming requests
app.use((req, res, next) => {
  console.log("📩 Incoming:", req.method, req.url);
  next();
});
app.get("/ping", (req, res) => {
  console.log("🏓 Ping received");
  res.send("pong");
});


// 📥 Handle a gift
app.post("/api/gift", (req, res) => {
  try {
    const { tier } = req.body;

    const log = {
      type: "gift",
      tier: tier.name,
      amount: tier.amount,
      ripple: 0.47,
      timestamp: new Date().toISOString(),
      message: `Gift of $${tier.amount} (${tier.name}) received. Ripple queued.`,
    };

    const ledgerPath = path.join(__dirname, "ripple-log.json");
    let ledger = [];

    if (fs.existsSync(ledgerPath)) {
      ledger = JSON.parse(fs.readFileSync(ledgerPath));
    }

    ledger.push(log);
    fs.writeFileSync(ledgerPath, JSON.stringify(ledger, null, 2));

    console.log("💠 Gift recorded:", log);
    res.json({
      status: "success",
      ripple: 0.47,
      message: `Ripple of $0.47 BTC sent from your ${tier.name} gift.`,
    });
  } catch (err) {
    console.error("❌ Error in /api/gift:", err);
    res.status(500).json({ error: "Internal error processing gift." });
  }
});

// 🔁 Handle ripple forward
app.post("/api/ripple-forward", (req, res) => {
  try {
    const { tier } = req.body;

    const log = {
      type: "ripple_forward",
      tier: tier.name,
      timestamp: new Date().toISOString(),
      message: `Ripple of $0.47 from ${tier.name} sent forward.`,
    };

    const ledgerPath = path.join(__dirname, "ripple-log.json");
    let ledger = [];

    if (fs.existsSync(ledgerPath)) {
      ledger = JSON.parse(fs.readFileSync(ledgerPath));
    }

    ledger.push(log);
    fs.writeFileSync(ledgerPath, JSON.stringify(ledger, null, 2));

    console.log("🪷 Ripple forward recorded:", log);
    res.json({ status: "success", ripple: 0.47 });
  } catch (err) {
    console.error("❌ Error in /api/ripple-forward:", err);
    res.status(500).json({ error: "Internal error forwarding ripple." });
  }
});

// 📜 Get full lineage
app.get("/api/lineage", (req, res) => {
  try {
    const ledgerPath = path.join(__dirname, "ripple-log.json");

    if (!fs.existsSync(ledgerPath)) {
      return res.json([]);
    }

    const ledger = JSON.parse(fs.readFileSync(ledgerPath));
    res.json(ledger);
  } catch (err) {
    console.error("❌ Error in /api/lineage:", err);
    res.status(500).json({ error: "Internal error reading lineage." });
  }
});

// 🌐 Start the sacred server
console.log("👁 A — Beginning server setup");

app.listen(PORT, "0.0.0.0", () => {
  console.log(`💗 PromptFlora server listening on 0.0.0.0:${PORT}`);
});


console.log("👁 B — After app.listen");

process.on("SIGINT", () => {
  console.log("🛑 Server interrupted");
  process.exit();
});

process.on("exit", (code) => {
  console.log(`👋 Server exited with code ${code}`);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("💥 Unhandled Rejection:", reason);
});
setInterval(() => {}, 1 << 30); // Keeps Node alive
