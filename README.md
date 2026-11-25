# Stripe Invoice Bulk Downloader — Store-Ready Package

Version 1.1 — prepared for Chrome Web Store submission.

## What’s included
- Full Manifest V3 extension
- Checkbox selection + floating toolbar
- JSZip packaging
- Freemium (5 free downloads)
- Options page (filename template)
- Privacy policy (privacy.html — host this publicly)
- Store listing text (STORE_LISTING.md)
- Icons (16/32/48/128)

## Chrome Web Store Checklist
- [ ] Host privacy.html at a public HTTPS URL and put the link in the dashboard
- [ ] Replace example.com/upgrade with your real payment page (Lemon Squeezy etc.)
- [ ] Take real screenshots (1280×800) of the extension on Stripe
- [ ] Fill permission justifications from STORE_LISTING.md
- [ ] Test thoroughly on a live Stripe account
- [ ] Register developer account ($5 one-time) and enable 2FA
- [ ] Zip the folder (exclude .git, node_modules, etc.) and upload

## Local testing
1. chrome://extensions → Developer mode → Load unpacked
2. Go to Stripe → Invoices
3. Select invoices and download

To test Pro: open service worker console →  
`chrome.storage.local.set({ isPro: true })`

## Important
Selectors may still need adjustment after testing on a real Stripe page. The core logic is solid.
