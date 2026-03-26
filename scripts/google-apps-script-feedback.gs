/**
 * Google Apps Script: pegar en el editor de script vinculado a la hoja
 * https://docs.google.com/spreadsheets/d/1G2IkWTKixrKzlIheYWposMLwGBSvU1Yq-7IAwDySfoI/edit
 *
 * La primera hoja debe tener en la fila 1: email | comentario
 *
 * Desplegar: Implementar → Administrar implementaciones → Tipo: Aplicación web
 * - Ejecutar como: Yo
 * - Quién tiene acceso: Cualquiera  (si no, el servidor recibe 403)
 * - URL …/exec (no /dev)
 * Tras cambiar el código: nueva versión del despliegue.
 *
 * El servidor envía application/x-www-form-urlencoded (email, comentario, secret opcional).
 * También acepta application/json por compatibilidad.
 */

var SPREADSHEET_ID = "1G2IkWTKixrKzlIheYWposMLwGBSvU1Yq-7IAwDySfoI";

function doPost(e) {
  try {
    var email = "";
    var comentario = "";
    var secret = "";

    if (e.postData && e.postData.contents) {
      var ct = (e.postData.type || "").toLowerCase();
      if (ct.indexOf("json") !== -1) {
        var data = JSON.parse(e.postData.contents);
        email = data.email || "";
        comentario = data.comentario || "";
        secret = data.secret || "";
      }
    }

    if (!comentario && e.parameter) {
      email = e.parameter.email || "";
      comentario = e.parameter.comentario || "";
      secret = e.parameter.secret || "";
    }

    var expected = PropertiesService.getScriptProperties().getProperty("EXPECTED_SECRET");
    if (expected && secret !== expected) {
      return ContentService.createTextOutput(JSON.stringify({ ok: false }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheets()[0];
    sheet.appendRow([email, comentario]);
    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
