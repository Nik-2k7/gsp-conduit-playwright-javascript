@echo off
npm install
npx playwright install chromium
npm test
