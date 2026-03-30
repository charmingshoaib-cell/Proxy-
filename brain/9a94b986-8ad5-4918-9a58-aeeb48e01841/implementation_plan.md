# [Console Data Extractor]

This script is designed to be pasted into the browser console of a casino site (like Stake, Wolf.bet, etc.) to capture game history and send it to your local Gemini DevTool Suite server for analysis.

## User Action Required
- **Server Running**: Ensure your `server.js` is running on `http://localhost:3005`.
- **Target Site**: Open the casino site and navigate to the game history or live stats page.

## Proposed Changes

### [NEW] [casino_scraper.js](file:///c:/Users/shoaib/.gemini/antigravity/scratch/gemini-devtool-suite/scripts/casino_scraper.js)
A robust script that intercepts network requests to capture raw JSON game data and sends it to the local IDE server.

## Verification Plan
1. Paste the script into the browser console.
2. Observe logs in the console to confirm data capture.
3. Check `server.js` logs to confirm data receipt.
