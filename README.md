# Festa di specializzazione — Ortopedia e Traumatologia

Sito-invito one-page per la seduta di specializzazione e la festa.
**Giovedì 5 novembre 2026 · seduta ore 14:00 (fine 17:00–17:30) · aperitivo e cena dalle 19:30 all'1:00 al Giardino dei Tempi – Orto Botanico, Bari.**

- **`index.html`**: il sito (HTML/CSS/JS, niente da compilare).
- **`apps-script.gs`**: il backend che salva le conferme su Google Sheets.

---

## Come vengono salvate le conferme

Ogni invitato inserisce **nome, cognome, chi l'ha invitato**, a cosa partecipa (seduta e festa / solo festa / solo seduta / non posso) ed eventuali intolleranze.

Ogni risposta finisce:
1. nel foglio **"Conferme – Festa specializzazione Ortopedia"** (scheda *Tutte le conferme*), con il riepilogo di tutti;
2. in un **Google Sheet separato per ogni festeggiato** (*"Invitati – Nome Cognome"*), creato automaticamente nella cartella Drive **festa specializzazione** al primo invitato.

## Attivare l'RSVP (5 minuti, una volta sola)

1. Apri su Drive il foglio **Conferme – Festa specializzazione Ortopedia** (cartella *festa specializzazione*).
2. Menu **Estensioni ▸ Apps Script**.
3. Cancella il codice di esempio e **incolla tutto `apps-script.gs`**. Salva.
4. **Distribuisci ▸ Nuova distribuzione** ▸ ingranaggio ▸ **App web**.
   - **Esegui come:** *Me stesso*. **Chi ha accesso:** *Chiunque*.
   - Distribuisci e autorizza (chiederà accesso a Fogli e Drive: serve per creare i fogli dei festeggiati).
5. Copia l'**URL dell'app web** (finisce con `/exec`) e incollalo in `index.html`:
   ```js
   const APPS_SCRIPT_URL = "https://script.google.com/macros/s/XXXX/exec";
   ```
6. Commit e push.

> Prova: apri l'URL `/exec` nel browser. Se vedi *"RSVP attivo ✅"* il backend risponde.

## Quando avete i nomi dei festeggiati

- In **`index.html`** compila `const HOSTS = ["Nome Cognome", ...];`: il campo "Chi ti ha invitato?" diventa un menu a tendina (niente errori di battitura, niente fogli doppi).
- (Facoltativo) In **Apps Script** compila `FESTEGGIATI` ed esegui una volta `creaFogliFesteggiati()` per avere subito tutti i fogli vuoti nella cartella.

## Pubblicare (GitHub Pages)

Impostazioni della repo ▸ **Pages** ▸ Source: *Deploy from a branch* ▸ `main` / `root` ▸ Save.
Il sito sarà su `https://eliocaiaffa.github.io/festa-specializzazione-/`.

## Da completare

- Sede e aula della seduta: card *Seduta di specializzazione* in `index.html` (`id="sedeSeduta"`).
