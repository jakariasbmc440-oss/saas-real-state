function doGet(e) {
  var action = (e && e.parameter) ? e.parameter.action : '';
  if (action === 'get_data') {
    var props = PropertiesService.getScriptProperties();
    var rawData = props.getProperty('STOREIQ_DATA');
    var dataObj = rawData ? JSON.parse(rawData) : null;
    return ContentService.createTextOutput(JSON.stringify({ success: true, data: dataObj }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  var output = { success: true, message: 'Store Management API is running', version: '1.0.0' };
  return ContentService.createTextOutput(JSON.stringify(output)).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var request = JSON.parse(e.postData.contents);
    var action = request.action;
    var payload = request.payload || {};
    var token = request.token || '';

    if (action === 'save_data') {
      var props = PropertiesService.getScriptProperties();
      props.setProperty('STOREIQ_DATA', JSON.stringify(payload));
      return ContentService.createTextOutput(JSON.stringify({ success: true, message: 'Data synced to cloud successfully' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (action === 'get_data') {
      var props = PropertiesService.getScriptProperties();
      var rawData = props.getProperty('STOREIQ_DATA');
      var dataObj = rawData ? JSON.parse(rawData) : null;
      return ContentService.createTextOutput(JSON.stringify({ success: true, data: dataObj }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    var response = Router.route(action, payload, token);
    return ResponseHelper.toJsonOutput(response);
  } catch (error) {
    Logger.log('doPost error: ' + error.toString());
    var errorResponse = ResponseHelper.error('SERVER_ERROR', 'An internal server error occurred: ' + error.message);
    return ResponseHelper.toJsonOutput(errorResponse);
  }
}

function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    .setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}