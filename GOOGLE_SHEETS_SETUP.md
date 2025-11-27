# Google Sheets Integration Setup

To enable the "Buy Now" feature to send data directly to your Google Sheet, follow these steps:

### 1. Create a Google Sheet
1. Go to [Google Sheets](https://sheets.google.com) and create a new sheet.
2. Name it "Course Requests".
3. In the first row, add these headers:
   - **A1:** Timestamp
   - **B1:** Name
   - **C1:** Email
   - **D1:** Phone
   - **E1:** Course

### 2. Add the Script
1. In your Google Sheet, go to **Extensions** > **Apps Script**.
2. Delete any code in the `Code.gs` file and paste the following:

```javascript
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var params = e.parameter;
    
    // Append the data
    sheet.appendRow([
      params.timestamp,
      params.name,
      params.email,
      params.phone,
      params.course
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
```

### 3. Deploy the Script
1. Click the blue **Deploy** button > **New deployment**.
2. Click the **Select type** gear icon > **Web app**.
3. Fill in the details:
   - **Description:** Course Request API
   - **Execute as:** Me (your email)
   - **Who has access:** **Anyone** (This is critical!)
4. Click **Deploy**.
5. You will be asked to authorize access. Click **Review permissions**, choose your account, click **Advanced**, and then **Go to (Project Name) (unsafe)**.
6. Click **Allow**.

### 4. Copy the URL
1. Copy the **Web app URL** provided (it starts with `https://script.google.com/macros/s/...`).
2. Go back to your code editor.
3. Open `src/pages/ProgramsDetail.jsx`.
4. Find line ~199: `const SCRIPT_URL = "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE";`
5. Replace the placeholder with your copied URL.

### 5. Test It!
1. Go to your website's Programs page.
2. Click "Buy Now" on a course.
3. Check your Google Sheet - a new row should appear!
