

# 📊 Gmail-to-Sheet Finance Tracker & Live Dashboard

A **serverless personal finance tracker** that automatically reads bank emails from Gmail, stores transactions in Google Sheets, and displays a **live financial dashboard** as a Web App.

> 🔐 No external servers  
> ⚡ Runs every hour automatically  
> 📈 Real-time dashboard  
> 👨‍👩‍👧 Family-shareable (view-only)  
> 💯 Fully inside Google ecosystem

---

## ✨ Features

### 📩 Gmail → Sheet Automation
- Reads bank emails automatically (hourly)
- Filters by **specific sender IDs**
- Extracts:
  - Date
  - Bank
  - Credit / Debit
  - Amount
  - Subject & snippet
- Prevents duplicates using **Message ID**

### 📊 Live Financial Dashboard (Web App)
- Total Balance
- Total Credit & Debit
- Transaction count
- Credit vs Debit chart
- Recent transactions table
- Auto-refresh every 60 seconds

### 👨‍👩‍👧 Family Finance View
- Share dashboard link
- View-only access
- No Gmail or Sheet edit permission
- Safe deployment (executes as owner)

---

## 🧱 Architecture Overview

```

Gmail (Bank Emails)
↓
Google Apps Script (Hourly Trigger)
↓
Google Sheets (Database)
↓
Apps Script Web App API
↓
Live Dashboard (HTML + JS)

```

---

## 📋 Prerequisites

- Google Account
- Gmail (bank alerts enabled)
- Google Sheets
- Basic familiarity with Google Apps Script

---

## 🗂 Spreadsheet Structure (IMPORTANT)

Create a Google Sheet and add the following headers in **Row 1**:

```

Date | Bank | From | Subject | Type | Amount | Snippet | Message ID

```

> ⚠️ Do not rename or reorder columns.

---

## 🧩 Project Files

```

/Finance-Tracker
│
├── Code.gs        # Backend (Gmail fetch + APIs)
├── index.html     # Frontend (Dashboard UI)
└── README.md      # This file

```

---

## 🧠 How It Works

1. **Hourly Trigger**
   - Scans Gmail for bank emails
   - Filters by sender & keywords
   - Extracts transaction details
   - Appends only new messages

2. **Web App**
   - Reads data from Sheet
   - Calculates totals in backend
   - Renders dashboard in browser

---

## 🚀 Step-by-Step Setup Guide

---

### 1️⃣ Create Google Sheet
1. Go to Google Sheets
2. Create a new spreadsheet
3. Add headers (Row 1):

```

Date | Bank | From | Subject | Type | Amount | Snippet | Message ID

```

---

### 2️⃣ Open Apps Script
1. Extensions → Apps Script
2. Delete default code
3. Paste **full `Code.gs`** (provided separately)
4. Save

---

### 3️⃣ Add Frontend File
1. In Apps Script → **+ New File**
2. Choose **HTML**
3. Name it `index`
4. Paste **full `index.html` code**
5. Save

---

### 4️⃣ First-Time Authorization
Run these **once** from Apps Script editor:

- ▶ `fetchBankMailsHourly`
- ▶ `createHourlyTrigger`

Approve permissions:
- Gmail (read-only)
- Google Sheets

---

### 5️⃣ Deploy Web App 🌐
1. Click **Deploy → New Deployment**
2. Select **Web App**
3. Set:
   - Execute as: **Me**
   - Who has access: **Anyone with Google Account**
4. Deploy
5. Copy the Web App URL

---

## 📊 Dashboard Metrics Explained

| Metric | Meaning |
|------|--------|
| Total Credit | Sum of all credited amounts |
| Total Debit | Sum of all debited amounts |
| Balance | Credit − Debit |
| Transactions | Total rows in sheet |
| Chart | Credit vs Debit comparison |

> Rows with `Type = "Unknown"` are displayed but **not included** in totals.

---

## 🧪 Demo Data Validation

Example data in Sheet:

```

Debit     60.99
Unknown   99
Credit    1300

````

Dashboard result:
- Total Credit: ₹1300
- Total Debit: ₹60.99
- Balance: ₹1239.01 ✅

---

## 🔁 Auto Update Behavior

- Gmail scan: **Every 1 hour**
- Dashboard refresh: **Every 60 seconds**
- No duplicate transactions ever

---

## 🔐 Security Notes

- Gmail access limited by sender + keywords
- Web App executes as owner
- Viewers cannot edit Sheet
- No external API or database used

---

## 🛠 Customization

### ➕ Add Bank Senders
Edit in `Code.gs`:
```js
const BANK_SENDERS = ["@sbi.co.in", "@hdfcbank.net"];
````

### ➕ Add Keywords

```js
const KEYWORDS = ["credit", "debit", "upi"];
```

### ⏱ Change Trigger Interval

```js
.everyHours(1) // change to 2, 4, etc.
```

---

## 🧯 Troubleshooting

### Dashboard shows nothing?

* Ensure Web App is redeployed
* Check Sheet name matches `SHEET_NAME`
* Verify data exists below header row

### Totals incorrect?

* Ensure Amount column contains numeric values
* "Unknown" type rows are excluded intentionally

---

## 📦 Limitations

* Cannot read PDF statements
* Amount extraction depends on email format
* Not a replacement for official bank statements

---

## 🛣 Roadmap (Optional Enhancements)

* 🤖 AI expense categorization
* 📱 Mobile PWA
* 🔔 Instant debit alerts
* 📊 Monthly forecasting
* 🧾 PDF reports
* 👨‍👩‍👧 Multi-profile family view

---

## 📄 License

MIT License
Free for personal & educational use.

---

## 🙌 Acknowledgements

Built using:

* Google Apps Script
* Google Sheets
* Gmail API
* Chart.js

---

## 💡 Final Note

This project gives you **bank-level visibility without sharing data with any third-party app**.

If saying *“I want my finances automated”* was the goal —
**you’ve already achieved it.** 🚀

