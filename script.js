const SHEET_ID = '115R-qpOjrc9J5Wmv17aIUHzrhOSNXkItE-wzdOjIpLU';

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    // เรียงคอลัมน์: เวลาบันทึก, ชื่อครู, ระดับชั้น, วิชา, วัน, เวลา, ห้องเรียน, โน้ต
    sheet.appendRow([
      new Date(), 
      data.teacherName,
      data.level,
      data.subject,
      data.day,
      data.time,
      data.room,
      data.note
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({"status": "success"})).setMimeType(ContentService.MimeType.JSON);
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({"status": "error", "message": error.message})).setMimeType(ContentService.MimeType.JSON);
  }
}
