/* ============================================================
   TRACE Schools — Wellness Champion Playlist, fallback song list

   Empty on purpose. Real submissions come from the published Google
   Sheet (see SETUP.md); this list is only what the page falls back to
   if that Sheet is unreachable. With both empty, the board shows its
   "nothing here yet" state, which is the honest thing to show before
   anyone has sent a song.

   Paste entries in here only if you want a copy frozen in the repo —
   for an end-of-year archive, say, or to keep the board from going
   blank if the Sheet ever gets deleted. Format:

     { song: "Mr. Blue Sky", artist: "Electric Light Orchestra",
       who: "Ellen H.", why: "Impossible to be in a bad mood." },

   artist, who, and why may each be "".

   This is a .js file rather than .json on purpose: browsers block
   fetch() when a page is opened straight off the disk (file://), so a
   .json file here would leave the page blank until it was served over
   http. A script tag loads either way.
   ============================================================ */
window.TRACE_PLAYLIST_SEED = [];
