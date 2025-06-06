#!/bin/bash

# -----------------------------------------------
# PromptFlora Maintenance Check Script
# Use this to check for outdated dependencies
# and inspect all React (.tsx) components in the repo.
# Run this anytime you're syncing with upstream packages,
# checking design component drift, or preparing for updates.
# -----------------------------------------------

# 🔍 Check for outdated packages
npx npm-check-updates

echo ""

# 🔎 List all React components and preview top of file
find . -type f -name "*.tsx" | while read file; do
  echo "📝 File: $file"
  head -n 5 "$file"
done

echo ""
echo "💡 Tip: Run 'npx npm-check-updates -u && npm install' to apply updates."
