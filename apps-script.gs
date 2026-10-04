/**
 * Festa di specializzazione Ortopedia — backend RSVP
 *
 * Ogni conferma dal sito viene salvata:
 *   1. nel foglio "Tutte le conferme" di QUESTO Google Sheet (il riepilogo generale);
 *   2. in un Google Sheet separato per ogni festeggiato ("Invitati – Nome Cognome"),
 *      creato automaticamente nella cartella Drive "festa specializzazione" al primo invitato.
 *
 * COME USARLO (istruzioni complete in README.md):
 *  1. Apri il foglio "Conferme – Festa specializzazione Ortopedia" nella cartella Drive.
 *  2. Menu  Estensioni ▸ Apps Script  e incolla questo file.
 *  3. Distribuisci ▸ Nuova distribuzione ▸ tipo "App web":
 *        - Esegui come:  Me stesso
 *        - Chi ha accesso:  Chiunque
 *  4. Copia l'URL /exec e incollalo in index.html (const APPS_SCRIPT_URL).
 */

// Cartella Drive "festa specializzazione"
var FOLDER_ID = '1oM68fSZzYe27ZlpFJX2_CeagZp01QWZX';

// Quando avrete i nomi, inseriteli qui ed eseguite una volta creaFogliFesteggiati()
// per avere subito tutti i fogli pronti (altrimenti si creano da soli al primo invitato).
var FESTEGGIATI = [
  'Gianni Brunetti', 'Elio Caiaffa', 'Giulia Colasuonno', 'Francesco Conte', "Matteo D'Aprile",
  'Barbara Guglielmi', 'Antonio Minchillo & Marilù Mancini', 'Sarah Manto',
  'Maurizio Pastore', 'Fabrizio Piacquadio', 'Nicola Reggente'
];

var HEADERS = ['Data e ora', 'Nome', 'Cognome', 'Invitato da', 'Partecipazione', 'Intolleranze / note'];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var p = (e && e.parameter) ? e.parameter : {};
    var host = normalizzaNome(p.invitatoDa || '');
    var row = [new Date(), p.nome || '', p.cognome || '', host, p.partecipazione || '', p.intolleranze || ''];

    // 1. Riepilogo generale
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var all = ss.getSheetByName('Tutte le conferme') || ss.insertSheet('Tutte le conferme', 0);
    preparaIntestazioni(all);
    all.appendRow(row);

    // 2. Foglio del festeggiato
    if (host) {
      var hostSheet = foglioFesteggiato(host).getSheets()[0];
      preparaIntestazioni(hostSheet);
      hostSheet.appendRow(row);
    }

    return ContentService.createTextOutput('ok');
  } catch (err) {
    return ContentService.createTextOutput('error: ' + err);
  } finally {
    lock.releaseLock();
  }
}

// Utile per testare l'URL nel browser.
function doGet() {
  return ContentService.createTextOutput('Festa specializzazione Ortopedia — RSVP attivo ✅');
}

// Restituisce (o crea) il Google Sheet "Invitati – <host>" nella cartella della festa.
function foglioFesteggiato(host) {
  var folder = DriveApp.getFolderById(FOLDER_ID);
  var name = 'Invitati – ' + host;
  var files = folder.getFilesByName(name);
  if (files.hasNext()) return SpreadsheetApp.open(files.next());

  var ss = SpreadsheetApp.create(name);
  DriveApp.getFileById(ss.getId()).moveTo(folder);
  ss.getSheets()[0].setName('Invitati');
  return ss;
}

function preparaIntestazioni(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
}

// "  mario   ROSSI " -> "Mario Rossi": evita fogli doppi se il nome è scritto in modi diversi.
function normalizzaNome(s) {
  return String(s).trim().replace(/\s+/g, ' ').toLowerCase()
    .replace(/(^|[\s'-])(\S)/g, function (m, sep, c) { return sep + c.toUpperCase(); });
}

// Da eseguire a mano (▶ Esegui) dopo aver compilato FESTEGGIATI.
function creaFogliFesteggiati() {
  FESTEGGIATI.forEach(function (h) {
    preparaIntestazioni(foglioFesteggiato(normalizzaNome(h)).getSheets()[0]);
  });
}
