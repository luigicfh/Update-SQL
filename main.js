function onChange(e) {
  const callId = e.values.at(1).trim();
  const newDisposition = e.values.at(-1).trim();
  const dbConnectionString =
    PropertiesService.getScriptProperties().getProperty("connectionString");
  const dbUser = PropertiesService.getScriptProperties().getProperty("dbUser");
  const dbPassword =
    PropertiesService.getScriptProperties().getProperty("dbPassword");
  const table = PropertiesService.getScriptProperties().getProperty("table");
  let rowId;
  try {
    const dbConnection = Jdbc.getCloudSqlConnection(
      dbConnectionString,
      dbUser,
      dbPassword
    );
    const statement = dbConnection.createStatement();
    const results = statement.executeQuery(
      `SELECT id FROM ${table} WHERE call_id=${callId}`
    );

    while (results.next()) {
      rowId = results.getString(1);
    }
    results.close();
    statement.close();
    const updateStatement = dbConnection.createStatement();
    updateStatement.executeUpdate(
      `UPDATE ${table} SET disposition_name="${newDisposition}" WHERE id='${rowId}'`
    );
    dbConnection.close();
    const sheetName = "Form Responses 1";
    const sheet =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    const lastRow = sheet.getLastRow();
    const range = sheet.getRange(`${lastRow}:${lastRow}`);
    range.setBackground("#00FF04");
  } catch (err) {
    Logger.log(err.message);
  }
}
