/*************************************************
 * CONFIG
 *************************************************/
const SHEET_NAME = "Sheet1";

// Bank senders
const BANK_SENDERS = [
  "@sbi.co.in",
  "@hdfcbank.net",
  "@icicibank.com",
  "@axisbank.com",
  "@paytm.com",
  "@phonepe.com",
  "@google.com"
];

const KEYWORDS = ["credit", "debit", "payment", "upi", "inr"];
const THREAD_LIMIT = 100;


/*************************************************
 * 1️⃣ HOURLY MAIL FETCHER
 *************************************************/
function fetchBankMailsHourly() {

  const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error("Sheet not found");

  const lastRow = sheet.getLastRow();
  const existingIds = lastRow > 1
    ? new Set(sheet.getRange(2, 8, lastRow - 1, 1).getValues().flat())
    : new Set();

  const senderQuery = BANK_SENDERS.map(s => `from:${s}`).join(" OR ");
  const keywordQuery = KEYWORDS.join(" OR ");
  const searchQuery = `(${senderQuery}) (${keywordQuery})`;

  const threads = GmailApp.search(searchQuery, 0, THREAD_LIMIT);

  threads.forEach(thread => {
    thread.getMessages().forEach(msg => {

      const msgId = msg.getId();
      if (existingIds.has(msgId)) return;

      const subject = msg.getSubject();
      const from = msg.getFrom();
      const date = msg.getDate();
      const body = msg.getPlainBody();

      const bankMatch = from.match(/@([\w.-]+)/);
      const bank = bankMatch ? bankMatch[1] : "Unknown";

      let type = "Unknown";
      if (/credit/i.test(subject + body)) type = "Credit";
      else if (/debit/i.test(subject + body)) type = "Debit";

      const amountMatch = body.match(/(?:INR|Rs\.?|₹)\s?([\d,]+\.?\d{0,2})/i);
      const amount = amountMatch ? amountMatch[1].replace(/,/g, "") : "";

      const snippet = body.substring(0, 150).replace(/\n/g, " ");

      sheet.appendRow([
        date,
        bank,
        from,
        subject,
        type,
        amount,
        snippet,
        msgId
      ]);

      existingIds.add(msgId);
    });
  });
}


/*************************************************
 * 2️⃣ WEB APP
 *************************************************/
function doGet() {
  return HtmlService.createHtmlOutputFromFile("index")
    .setTitle("Family Finance Dashboard")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}


/*************************************************
 * 3️⃣ RAW DATA API (FIXED)
 *************************************************/
function getFinanceData() {
  const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  data.shift();
  return data;
}


/*************************************************
 * 4️⃣ DASHBOARD STATS (FIXED CALCULATION)
 *************************************************/
function getDashboardStats() {

  const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
  const rows = sheet.getDataRange().getValues().slice(1);

  let credit = 0;
  let debit = 0;

  rows.forEach(r => {
    const type = String(r[4]).toLowerCase();
    const amt = parseFloat(r[5]);

    if (isNaN(amt)) return;

    if (type === "credit") credit += amt;
    if (type === "debit") debit += amt;
  });

  return {
    totalCredit: credit,
    totalDebit: debit,
    balance: credit - debit,
    transactions: rows.length
  };
}


/*************************************************
 * 5️⃣ CREATE HOURLY TRIGGER (RUN ONCE)
 *************************************************/
function createHourlyTrigger() {
  ScriptApp.getProjectTriggers()
    .forEach(t => ScriptApp.deleteTrigger(t));

  ScriptApp.newTrigger("fetchBankMailsHourly")
    .timeBased()
    .everyHours(1)
    .create();
}
