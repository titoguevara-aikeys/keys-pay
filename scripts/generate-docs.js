#!/usr/bin/env node

/**
 * Keys Pay Documentation Generator
 * Automatically generates OpenAPI spec and Postman collection
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Generating Keys Pay API Documentation...');

// Ensure directories exist
const dirs = ['docs', 'postman'];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Copy OpenAPI spec to docs
if (fs.existsSync('openapi/openapi.yaml')) {
  fs.copyFileSync('openapi/openapi.yaml', 'docs/openapi.yaml');
  console.log('✅ OpenAPI spec copied to docs/');
}

// Copy Postman collection 
if (fs.existsSync('postman/KeysPay.collection.json')) {
  fs.copyFileSync('postman/KeysPay.collection.json', 'docs/KeysPay.collection.json');
  console.log('✅ Postman collection copied to docs/');
}

// Generate API status page
const statusHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Keys Pay API Status</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 40px; }
        .status { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; }
        .status.up { background: #dcfce7; color: #166534; }
        .header { margin-bottom: 30px; }
        .disclaimer { background: #f8fafc; padding: 20px; border-radius: 8px; margin-top: 30px; font-size: 14px; color: #64748b; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Keys Pay API Status</h1>
        <p>Dubai DED compliant aggregator platform for virtual assets and financial services</p>
        <span class="status up">Operational</span>
    </div>
    
    <h2>Integrated Providers</h2>
    <ul>
        <li><strong>Transak</strong> - Crypto On/Off Ramp <span class="status up">Up</span></li>
        <li><strong>Nium</strong> - FX & Payouts <span class="status up">Up</span></li>
        <li><strong>Guardarian</strong> - Crypto Off-Ramp <span class="status up">Up</span></li>
        <li><strong>OpenPayd</strong> - Virtual IBANs <span class="status up">Up</span></li>
    </ul>

    <h2>API Documentation</h2>
    <ul>
        <li><a href="openapi.yaml">OpenAPI 3.0 Specification</a></li>
        <li><a href="KeysPay.collection.json">Postman Collection</a></li>
    </ul>

    <div class="disclaimer">
        <strong>Legal Disclaimer:</strong> Keys Pay is a technology platform operating as an aggregator under Dubai DED Commercial License (No. 1483958, CR No. 2558995). All regulated financial services are provided directly by licensed third-party providers (Transak, Nium, Guardarian, OpenPayd). Keys Pay does not custody client funds, issue financial products, or act as Merchant of Record.
    </div>
</body>
</html>
`;

fs.writeFileSync('docs/index.html', statusHtml);
console.log('✅ API status page generated at docs/index.html');

console.log('🎉 Documentation generation complete!');