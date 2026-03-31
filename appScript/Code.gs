const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

function doGet(e) {
  const action = e.parameter.action;
  
  if (action === 'getUsers') {
    try {
      const users = getRegisteredUsers();
      return createCorsResponse({ status: 'success', data: users });
    } catch (error) {
      return createCorsResponse({ status: 'error', message: error.toString() });
    }
  }
  
  const page = e.parameter.page ? e.parameter.page.trim().toLowerCase() : '';
  
  if (page === 'waitlist') {
    return HtmlService.createHtmlOutputFromFile('Waitlist')
      .setTitle('Waitlist - Bema Hub');
  }
  
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Bema Hub Waitlist');
}

function doPost(e) {
  try {
    if (!e.postData || !e.postData.contents) {
      return createCorsResponse({ status: 'error', message: 'No data provided' });
    }
    
    Logger.log('Raw postData: ' + e.postData.contents);
    
    const postData = JSON.parse(e.postData.contents);
    Logger.log('Parsed postData: ' + JSON.stringify(postData));
    
    if (!postData.firstName || !postData.lastName || !postData.email || !postData.phone || !postData.location) {
      return createCorsResponse({ status: 'error', message: 'Missing required fields' });
    }
    
    const formData = {
      firstName: postData.firstName,
      lastName: postData.lastName,
      email: postData.email,
      phone: postData.phone,
      location: postData.location,
      referrerName: postData.referrerName || '',
      referrerPhone: postData.referrerPhone || '',
      referrerEmail: postData.referrerEmail || ''
    };
    
    Logger.log('FormData prepared: ' + JSON.stringify(formData));
    
    const result = submitForm(formData);
    
    try {
      sendNotificationEmail(formData);
    } catch (emailError) {
      Logger.log('Email error: ' + emailError.toString());
    }
    
    return createCorsResponse({ status: 'success', message: 'Form submitted successfully' });
  } catch (error) {
    Logger.log('doPost error: ' + error.toString());
    return createCorsResponse({ status: 'error', message: error.toString() });
  }
}

function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(CORS_HEADERS);
}

function createCorsResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(CORS_HEADERS);
}

function submitForm(formData) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['First Name', 'Last Name', 'Email', 'Phone', 'Location', 'Referrer Name', 'Referrer Phone', 'Referrer Email', 'Timestamp']);
  }
  
  sheet.appendRow([
    formData.firstName,
    formData.lastName,
    formData.email,
    "'" + formData.phone,
    formData.location,
    "'" + formData.referrerName,
    "'" + formData.referrerPhone,
    "'" + formData.referrerEmail,
    new Date()
  ]);
  
  return 'Success';
}

function sendNotificationEmail(formData) {
  Logger.log('sendNotificationEmail called with: ' + JSON.stringify(formData));
  
  if (!formData || !formData.firstName) {
    Logger.log('Email skipped: formData missing');
    return;
  }
  
  const recipient = 'akfaleye@gmail.com';
  const subject = 'New Waitlist Signup - Bema Hub';
  
  const body = `
New user has joined the Bema Hub waitlist!

Details:
- Name: ${formData.firstName || ''} ${formData.lastName || ''}
- Email: ${formData.email || 'N/A'}
- Phone: ${formData.phone || 'N/A'}
- Location: ${formData.location || 'N/A'}
- Referrer: ${formData.referrerName || 'N/A'} (${formData.referrerPhone || 'N/A'})
- Referrer Email: ${formData.referrerEmail || 'N/A'}
- Timestamp: ${new Date().toLocaleString()}
  `.trim();
  
  try {
    MailApp.sendEmail(recipient, subject, body);
    Logger.log('Email sent successfully');
  } catch (error) {
    Logger.log('MailApp.sendEmail error: ' + error.toString());
    throw error;
  }
}

function testEmail() {
  const testData = {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    phone: '+1234567890',
    location: 'Test Location',
    referrerName: 'Referrer',
    referrerPhone: '+0987654321',
    referrerEmail: 'referrer@test.com'
  };
  sendNotificationEmail(testData);
  return 'Email test completed - check your inbox';
}

function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  const day = d.getDate();
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  let hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`;
}

function getRegisteredUsers() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const lastRow = sheet.getLastRow();
    
    Logger.log('Last row: ' + lastRow);
    
    if (lastRow <= 1) {
      return [];
    }
    
    const data = sheet.getRange(2, 1, lastRow - 1, 9).getValues();
    
    Logger.log('Data rows: ' + data.length);
    
    const users = data.map(row => ({
      firstName: row[0] || '',
      lastName: row[1] || '',
      email: row[2] || '',
      phone: row[3] || '',
      location: row[4] || '',
      referrerName: row[5] || '',
      referrerPhone: row[6] || '',
      referrerEmail: row[7] || '',
      timestamp: formatDate(row[8])
    }));
    
    Logger.log('Users: ' + JSON.stringify(users));
    return users;
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    throw error;
  }
}
