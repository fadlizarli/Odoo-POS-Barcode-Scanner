# Odoo POS Camera Barcode Scanner

A lightweight barcode scanner for Odoo Point of Sale using your device's camera.

Originally developed by [Potacado](https://github.com/Potacado/Odoo-POS-Barcode-Scanner) for Odoo 16. This fork has been updated for **Odoo 17** compatibility.

## Features

- 📷 Scan barcodes directly from your device camera
- 🔍 Auto-detect products by barcode
- 📱 Mobile-friendly UI with scan button below order total
- 🌐 Works on any browser (requires HTTPS for camera access)
- 📦 Quagga2 library bundled locally (no CDN dependency)

## Compatibility

- ✅ Odoo 17
- ✅ iOS Safari (requires HTTPS)
- ✅ Android Chrome (requires HTTPS)
- ✅ Desktop Chrome/Firefox

## Requirements

- Odoo 17
- HTTPS (required for camera access on mobile browsers)

## Installation

1. Copy `pos_camera_scanner` folder to your Odoo addons directory
2. Restart Odoo server
3. Enable Developer Mode: Settings → General Settings → Activate Developer Mode
4. Go to Apps → Update Apps List
5. Search for **POS Custom Camera Scanner** and install

## Setup HTTPS (Required for Mobile Camera)

Camera access requires HTTPS. You can use:
- Free domain from [DuckDNS](https://duckdns.org) or [FreeDNS](https://freedns.afraid.org)
- SSL certificate from [Let's Encrypt](https://letsencrypt.org) (free)
- Nginx as reverse proxy

## Usage

1. Open Point of Sale session
2. Tap **Scan Barcode** button below the order total
3. Allow camera access when prompted
4. Point camera at barcode
5. Product will be automatically added to order

## Important Notes

- Wait 3-5 minutes after opening POS for all products to fully load into cache before scanning
- If product not found locally, scanner will search on server automatically
- HTTPS is mandatory for camera access on iOS and modern Android browsers

## Changes from Original (Odoo 16 → Odoo 17)

- Updated OWL component system (removed `Registries`, use `patch` instead)
- Updated asset bundle from `point_of_sale.assets` to `point_of_sale._assets_pos`
- Updated popup system to use `AbstractAwaitablePopup`
- Bundled Quagga2 library locally (removed CDN dependency)
- Moved scan button to mobile-friendly position (below order total)
- Added autofocus support for better scanning experience
- Fixed template naming convention for Odoo 17

## Credits

- Original module: [Potacado](https://github.com/Potacado/Potacado/Odoo-POS-Barcode-Scanner)
- Odoo 17 update: [fadlizarli](https://github.com/fadlizarli)
- Powered by [Quagga2](https://github.com/ericblade/quagga2)
