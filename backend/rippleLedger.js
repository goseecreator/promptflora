const fs = require("fs");
const path = require("path");

const ledgerPath = path.join(__dirname, "ripple-log.json");

function writeToLedger(tier) {
  const log = {
    tier: tier.name,
    amount: tier.amount,
    ripple: 0.47,
    timestamp: new Date().toISOString(),
  };

  let ledger = [];

  if (fs.existsSync(ledgerPath)) {
    ledger = JSON.parse(fs.readFileSync(ledgerPath));
  }

  ledger.push(log);
  fs.writeFileSync(ledgerPath, JSON.stringify(ledger, null, 2));
}

module.exports = { writeToLedger };
