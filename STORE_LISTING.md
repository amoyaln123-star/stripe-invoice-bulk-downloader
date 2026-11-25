# Chrome Web Store Listing Text

## Name
Stripe Invoice Bulk Downloader

## Summary (132 chars max)
Download selected Stripe invoices as a clean ZIP in one click. Perfect for bookkeeping.

## Description
Stop downloading Stripe invoices one by one.

Stripe Invoice Bulk Downloader adds checkboxes to your Stripe Invoices page so you can select exactly the invoices you need and download them as a single renamed ZIP file.

**Features:**
- Select any invoices with checkboxes
- One-click download as ZIP
- Smart filenames (date, number, amount)
- Works entirely in your browser — nothing is uploaded
- Free tier with optional Pro upgrade

Ideal for freelancers, accountants, and anyone who needs to archive Stripe invoices quickly.

## Category
Productivity

## Single Purpose
Download selected invoices from the Stripe Dashboard as a ZIP file.

## Permission Justifications
- activeTab + host_permissions (dashboard.stripe.com): To inject the selection UI and read invoice download links only on the Stripe Invoices page.
- downloads: To save the generated ZIP file to the user's computer.
- storage: To store a local free-usage counter (never leaves the device).
