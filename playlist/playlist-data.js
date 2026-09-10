/* ============================================================
   TRACE Schools — Wellness Champion Playlist, shared data layer
   Loaded by /playlist/ (the full word cloud) and by the September
   issue (the small teaser). One config, one parser, one grouping
   rule, so the two pages can never disagree about the data.

   ------------------------------------------------------------
   CONFIG — the only two lines you should ever need to edit.

   FORM_URL   Public link to the Google Form ("Send" → the link icon).

   SHEET_CSV  The responses Sheet, published as CSV:
              File → Share → Publish to web → pick the responses tab
              → Comma-separated values (.csv) → Publish.
              Paste that URL here. It ends in "output=csv".

   Leave SHEET_CSV empty and both pages fall back to the list in
   songs.js, which is the sample data you're seeing now.
   ============================================================ */
(function(){
  "use strict";

  var CONFIG = {
    FORM_URL:  "https://docs.google.com/forms/d/e/1FAIpQLSegHqmLIjgRfPUf0JYbBCtSzVh3jkGeQ4-ibhem4dDvU77ihg/viewform",

    /* The published-to-web CSV, not an /edit link — an edit link answers 401
       to anyone who isn't signed in with access. See SETUP.md step 2. */
    SHEET_CSV: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTm2nVKx_Odfwi6WFi7na_wzGWR38TP-Ft5t5cvV6UpVRgpA8vKvLBh-cv1Ow9RwMX383Oa1Wf32Pu8/pub?output=csv"
  };

  /* ---------------- CSV ----------------
     Google's published CSV quotes any field containing a comma, a
     quote, or a newline — which is roughly every "why this song"
     answer. A naive split(",") mangles them, so parse properly. */
  function parseCSV(text){
    var rows = [], row = [], field = "", i = 0, inQuotes = false;
    text = text.replace(/^﻿/, "");
    while (i < text.length) {
      var c = text.charAt(i);
      if (inQuotes) {
        if (c === '"') {
          if (text.charAt(i+1) === '"') { field += '"'; i += 2; continue; }
          inQuotes = false; i++; continue;
        }
        field += c; i++; continue;
      }
      if (c === '"') { inQuotes = true; i++; continue; }
      if (c === ",")  { row.push(field); field = ""; i++; continue; }
      if (c === "\r") { i++; continue; }
      if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; i++; continue; }
      field += c; i++;
    }
    if (field.length || row.length) { row.push(field); rows.push(row); }
    return rows;
  }

  /* Match the Sheet's header row to our four fields by keyword, so
     reordering or rewording a form question doesn't break the page. */
  function columnMap(header){
    var map = { song:-1, artist:-1, who:-1, why:-1 };
    header.forEach(function(h, idx){
      var k = String(h).toLowerCase();
      if (map.song   === -1 && /song|title|track/.test(k) && !/artist/.test(k)) { map.song = idx; return; }
      if (map.artist === -1 && /artist|band|singer|performer/.test(k))          { map.artist = idx; return; }
      if (map.who    === -1 && /name|who|from/.test(k) && !/song|artist/.test(k)){ map.who = idx; return; }
      if (map.why    === -1 && /why|what|mean|do for you|reason|story/.test(k)) { map.why = idx; return; }
    });
    return map;
  }

  function clean(s, max){
    s = String(s == null ? "" : s).replace(/\s+/g, " ").trim();
    if (max && s.length > max) s = s.slice(0, max - 1).trim() + "…";
    return s;
  }

  /* Belt and braces for a public page: if someone types an email address into
     the name or the note — their own or a colleague's — don't publish it.
     Deliberately not touching numbers: "867-5309/Jenny" is a song title. */
  function redact(s){
    return s.replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, "…").trim();
  }

  function rowsToEntries(rows){
    if (!rows.length) return [];
    var map = columnMap(rows[0]);
    /* Fall back to the first answer column (column 0 is the timestamp). */
    if (map.song === -1) map.song = rows[0].length > 1 ? 1 : 0;
    var out = [];
    for (var r = 1; r < rows.length; r++) {
      var row = rows[r];
      var song = clean(row[map.song], 90);
      if (!song) continue;
      out.push({
        song:   song,
        artist: map.artist > -1 ? clean(row[map.artist], 70)          : "",
        who:    map.who    > -1 ? redact(clean(row[map.who], 50))     : "",
        why:    map.why    > -1 ? redact(clean(row[map.why], 400))    : ""
      });
    }
    return out;
  }

  /* ---------------- grouping ----------------
     "Mr. Blue Sky" and "mr blue sky " are the same song, and someone
     will write "ELO" where someone else writes "Electric Light
     Orchestra". Normalise hard for the key; display whichever
     spelling arrived first. */
  function normalize(s){
    return String(s).toLowerCase()
      .replace(/[‘’“”]/g, "'")
      /* Drop apostrophes rather than letting the catch-all below turn them
         into spaces — otherwise "Don't Stop Me Now" normalises to
         "don t stop me now" and never matches someone's "Dont Stop Me Now". */
      .replace(/'/g, "")
      .replace(/&/g, " and ")
      .replace(/\(.*?\)/g, " ")
      .replace(/\b(feat|ft|featuring)\b.*$/, " ")
      .replace(/[^a-z0-9 ]/g, " ")
      .replace(/\s+/g, " ").trim();
  }

  /* Group on the song title alone. Keying on title+artist would split
     "September / Earth Wind & Fire" from "September / EW&F" into two
     entries, which is exactly the merge the cloud exists to show. */
  function group(entries){
    var byKey = {};
    entries.forEach(function(e){
      var k = normalize(e.song);
      if (!k) return;
      if (!byKey[k]) byKey[k] = { song:e.song, artist:e.artist, count:0, notes:[] };
      var g = byKey[k];
      g.count++;
      if (!g.artist && e.artist) g.artist = e.artist;
      if (e.who || e.why) g.notes.push({ who:e.who, why:e.why });
    });
    return Object.keys(byKey).map(function(k){ return byKey[k]; })
      .sort(function(a, b){
        if (b.count !== a.count) return b.count - a.count;
        return a.song.localeCompare(b.song);
      });
  }

  /* Stable hash — used for cloud colour and ordering so the layout
     doesn't reshuffle on every page load the way Math.random would. */
  function hash(s){
    var h = 2166136261;
    s = String(s);
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = (h * 16777619) >>> 0; }
    return h;
  }

  /* ---------------- load ----------------
     Calls back with { entries, groups, total, source }, where source is
     "sheet" for live responses or "fallback" for the songs.js list. */
  function load(done, fail){
    /* The fallback list is a plain script (songs.js), not a fetched file,
       so this path also works when the page is opened straight off the
       disk — where fetch() is blocked for local files. */
    function fromSeed(reason, afterSheetFailed){
      var list = window.TRACE_PLAYLIST_SEED;
      /* An empty seed is a real answer — "nobody has sent a song yet" — but
         only when we never tried the Sheet. If the Sheet was configured and
         failed, an empty seed tells us nothing, and showing "no songs yet"
         would claim something we don't know. Report the failure instead. */
      if (!list || (afterSheetFailed && !list.length)) {
        if (fail) fail(reason || "unavailable");
        return;
      }
      var entries = list.map(function(e){
        return {
          song:   clean(e.song, 90),
          artist: clean(e.artist, 70),
          who:    redact(clean(e.who, 50)),
          why:    redact(clean(e.why, 400))
        };
      }).filter(function(e){ return e.song; });
      done({ entries:entries, groups:group(entries), total:entries.length, source:"fallback" });
    }

    if (!CONFIG.SHEET_CSV) { fromSeed("not connected"); return; }

    fetch(CONFIG.SHEET_CSV, { cache: "no-store" })
      .then(function(r){ if (!r.ok) throw new Error("HTTP " + r.status); return r.text(); })
      .then(function(text){
        /* An unpublished or permission-blocked Sheet answers with a
           Google sign-in page, not a 4xx — so sniff for HTML. */
        if (/^\s*</.test(text)) throw new Error("got HTML, not CSV");
        var entries = rowsToEntries(parseCSV(text));
        done({ entries:entries, groups:group(entries), total:entries.length, source:"sheet" });
      })
      .catch(function(){ fromSeed("live list unavailable", true); });
  }

  window.TRACEPlaylist = {
    config: CONFIG,
    formUrl: function(){ return CONFIG.FORM_URL || ""; },
    load: load,
    hash: hash,
    parseCSV: parseCSV,
    rowsToEntries: rowsToEntries,
    group: group,
    clean: clean
  };
})();
