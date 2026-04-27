// Minimal multiple-choice quiz UI that records bits via Score.
//
// Usage:
//   Quiz.render({
//     mount: "#pretest-mount",
//     group: "pretest",       // "pretest" or "posttest"
//     title: "Before you start",
//     items: [
//       { idx: 0, q: "...", options: ["a","b","c","d"], correct: 2 },
//       { idx: 1, q: "...", options: [...],             correct: 0 }
//     ],
//     onComplete: () => { /* unlock next stage */ }
//   });
//
// Rendering: one collapsible card per item, each with radio options + Submit.
// On submit: records 1 (correct) or 0 (wrong) at items[i].idx in the chosen
// score group. Locks the radios. Shows no per-item "right/wrong" feedback
// (we don't want students gaming the bit string), only "answer recorded."
// When every item is answered, calls onComplete().

(function (global) {
  "use strict";

  function el(tag, attrs, kids) {
    const e = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      if (k === "class") e.className = attrs[k];
      else if (k === "html") e.innerHTML = attrs[k];
      else e.setAttribute(k, attrs[k]);
    }
    (kids || []).forEach(k => {
      if (k == null) return;
      e.appendChild(typeof k === "string" ? document.createTextNode(k) : k);
    });
    return e;
  }

  function render(opts) {
    const mount = typeof opts.mount === "string"
      ? document.querySelector(opts.mount) : opts.mount;
    if (!mount) {
      console.warn("Quiz: mount not found:", opts.mount);
      return;
    }
    const group = opts.group;
    const items = opts.items || [];
    const onComplete = typeof opts.onComplete === "function" ? opts.onComplete : null;
    const answered = new Set();

    mount.innerHTML = "";
    if (opts.title) {
      mount.appendChild(el("h3", { class: "quiz-title" }, [opts.title]));
    }
    if (opts.intro) {
      mount.appendChild(el("p", { class: "quiz-intro" }, [opts.intro]));
    }

    const recorder = group === "pretest" ? "recordPretest"
                   : group === "posttest" ? "recordPosttest"
                   : "recordCheckpoint";

    // Resume case: if every item is already answered (from localStorage),
    // skip rendering and call onComplete immediately so the host module
    // proceeds to the next gate.
    if (global.Score && typeof global.Score.allAnswered === "function"
        && global.Score.allAnswered(group)
        && items.length > 0) {
      mount.appendChild(el("p", { class: "quiz-status" }, [
        "(Already answered — skipping ahead.)"
      ]));
      if (onComplete) setTimeout(onComplete, 0);
      return;
    }

    items.forEach((item, i) => {
      const card = el("div", { class: "quiz-item" });
      card.appendChild(el("p", { class: "quiz-q" }, [
        el("span", { class: "quiz-q-num" }, [(i + 1) + ". "]),
        item.q
      ]));

      const opts_wrap = el("div", { class: "quiz-options" });
      const radioName = "quiz-" + group + "-" + item.idx;
      item.options.forEach((opt, oi) => {
        const id = radioName + "-" + oi;
        const lbl = el("label", { class: "quiz-option", for: id }, [
          el("input", { type: "radio", name: radioName, id: id, value: String(oi) }),
          el("span", null, [opt])
        ]);
        opts_wrap.appendChild(lbl);
      });
      card.appendChild(opts_wrap);

      const status = el("p", { class: "quiz-status" }, [""]);
      const btn = el("button", { type: "button", class: "quiz-submit" }, ["Submit"]);
      card.appendChild(btn);
      card.appendChild(status);

      // Per-item resume: if this single item was already answered, lock it
      // and treat it as recorded so the group can complete.
      if (global.Score && typeof global.Score.isAnswered === "function"
          && global.Score.isAnswered(group, item.idx)) {
        card.querySelectorAll("input[type=radio]").forEach(r => r.disabled = true);
        btn.disabled = true;
        status.textContent = "Answer recorded.";
        answered.add(item.idx);
      }

      btn.addEventListener("click", () => {
        const picked = card.querySelector("input[type=radio]:checked");
        if (!picked) {
          status.textContent = "Pick an option first.";
          return;
        }
        const choiceIdx = parseInt(picked.value, 10);
        const bit = (choiceIdx === item.correct) ? 1 : 0;
        if (global.Score && typeof global.Score[recorder] === "function") {
          global.Score[recorder](item.idx, bit);
        } else {
          console.warn("Quiz: Score." + recorder + " not available.");
        }
        // Lock the radios + button.
        card.querySelectorAll("input[type=radio]").forEach(r => r.disabled = true);
        btn.disabled = true;
        status.textContent = "Answer recorded.";
        answered.add(item.idx);
        if (answered.size === items.length && onComplete) onComplete();
      });

      mount.appendChild(card);
    });
  }

  global.Quiz = { render };
})(typeof window !== "undefined" ? window : globalThis);
