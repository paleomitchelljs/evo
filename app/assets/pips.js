/* pips.js -- the row of circles on a target card, now buttons (JM, 2026-10-26: "Within a part, I would rather students be able
   to freely advance targets ... The circles at the top stay open for unsolved targets, and close for solved ones, but clicking
   on them should change the target screen").

     el.innerHTML = Pips.html(n, solved(i) -> bool, current, off)   ○ unsolved, ● solved, ◉ the open unsolved one;
                                                                      the open one is underlined; off disables every circle.
                                                                      solved(i) may return "off": tried once, missed (lesson 15's one-shot targets): a red ●
     Pips.wire(el, i => open target i)                              once, on the element (clicks are delegated)

   A lesson decides what "open target i" does; a run in progress or a locked card passes off = true. */
const Pips = {
  html(n, solved, cur, off) {
    let s = "";
    for (let i = 0; i < n; i++) {
      const v = solved(i), ok = v === true || v === "ok", miss = v === "off", done = ok || miss;
      s += '<button type="button" class="pip' + (ok ? " ok" : miss ? " off" : "") + (i === cur ? " cur" : "") + '" data-i="' + i + '"' + (off ? " disabled" : "") + ' aria-label="target ' + (i + 1) + (ok ? ", solved" : miss ? ", missed" : "") + '">' + (done ? "●" : i === cur ? "◉" : "○") + "</button>";
    }
    return s;
  },
  wire(el, pick) {
    if (!el) return;
    el.addEventListener("click", e => { const b = e.target.closest && e.target.closest("button.pip"); if (b && !b.disabled) pick(+b.dataset.i); });
  }
};
