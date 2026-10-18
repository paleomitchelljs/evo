/* BIO 202 hover text. Companion to hover.css.
   An element with class "info" carries its words in a hidden <span class="tip"> (several <span>s inside it, one a
   line), or names a shared one by id with data-tip="...". The words show in one floating box on hover or keyboard
   focus; a tap shows them on a touch screen; moving off, scrolling or a click elsewhere hides them. A click that a
   <label> passes on to its slider or menu is not "elsewhere". JM, 2026-10-17: "The bullet points could really be
   turned into hover text ... I want attention drawn and fixed to controls, output, and predictions". */
(function () {
  function start() {
    const pop = document.createElement("div"); pop.className = "tip-pop"; pop.hidden = true; document.body.appendChild(pop);
    let on = null;
    const tipOf = el => el.dataset.tip ? document.getElementById(el.dataset.tip) : el.querySelector(".tip");
    const show = el => {
      const tip = tipOf(el); if (!tip) return;
      on = el; pop.innerHTML = tip.innerHTML; pop.hidden = false;
      for (const e of pop.querySelectorAll("[id]")) e.removeAttribute("id");   /* a live number in a tip is copied, not moved */
      const r = el.getBoundingClientRect(), w = pop.offsetWidth, h = pop.offsetHeight;
      pop.style.left = Math.max(8, Math.min(r.left, window.innerWidth - w - 8)) + "px";
      pop.style.top = (r.bottom + 6 + h > window.innerHeight - 8 && r.top - 6 - h > 8 ? r.top - 6 - h : r.bottom + 6) + "px";
    };
    const hide = () => { on = null; pop.hidden = true; };
    document.addEventListener("mouseover", e => { const el = e.target.closest(".info"); if (el !== on) el ? show(el) : hide(); });
    document.addEventListener("focusin", e => { const el = e.target.closest(".info"); if (el) show(el); });
    document.addEventListener("focusout", e => { if (e.target.closest(".info") === on) hide(); });
    document.addEventListener("click", e => {
      const el = e.target.closest(".info"), host = on && (on.closest("label") || on);
      if (el) { if (el !== on) show(el); } else if (!(host && (host.contains(e.target) || host.control === e.target))) hide();
    });
    window.addEventListener("scroll", hide, { passive: true });
    for (const el of document.querySelectorAll(".info:not([tabindex])")) el.tabIndex = 0;
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
