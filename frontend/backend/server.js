const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const { writeToLedger } = require("./rippleLedger");
const app = express();
const PORT = 3001;

app.use(cors({
    origin: "https://promptflora.org", // OR your custom domain
    methods: ["POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"]
  }));
  app.use(bodyParser.json());

// 💠 Ritual Gift Endpoint
app.post("/api/gift", (req, res) => {
  const { tier } = req.body;

  // ⛏ Simulated log for now (replace with BTC logic later)
  console.log(`🌊 ${tier.name} gift received — $${tier.amount}, ripple queued.`);
  writeToLedger(tier);

  // Simulated BTC forward response
  res.json({
    status: "success",
    ripple: 0.47,
    message: `Ripple of $0.47 BTC sent from your ${tier.name} gift.`,
  });
});

app.listen(PORT, () => {
  console.log(`🔮 PromptFlora server listening at http://localhost:${PORT}`);
});
