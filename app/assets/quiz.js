// Minimal multiple-choice quiz UI that records bits via Score.
//
// Usage:
//   Quiz.render({
//     mount: "#pretest-mount",
//     group: "pretest",       // "pretest" or "posttest"
//     title: "Before you start",
//     items: [
//       { idx: 0, q: "...", options: ["a","b","c","d"], correct: 2 },
//       { idx: 1, q: "...", options: [...],             correct: 0 },
//       // Multi-select: pass an array of correct indices. Renders checkboxes.
//       // Bit = 1 iff student selects exactly the correct set (no extras, no
//       // missing). Treat this as the "name what you built" closer item.
//       { idx: 2, q: "...", options: [...], correct: [0, 2, 3] }
//     ],
//     onComplete: () => { /* unlock next stage */ }
//   });
//
// Rendering: one card per item, radio options for single-select, checkboxes
// for multi-select, plus Submit. On submit: records 1 (correct) or 0 (wrong)
// at items[i].idx in the chosen score group. Locks the inputs. Shows no
// per-item "right/wrong" feedback (we don't want students gaming the bit
// string), only "answer recorded." When every item is answered, calls
// onComplete().

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
      const isMulti = Array.isArray(item.correct);
      const card = el("div", { class: "quiz-item" + (isMulti ? " quiz-item-multi" : "") });
      const qLine = [
        el("span", { class: "quiz-q-num" }, [(i + 1) + ". "]),
        item.q
      ];
      if (isMulti) qLine.push(el("span", { class: "quiz-multi-hint" }, [" (select all that apply)"]));
      card.appendChild(el("p", { class: "quiz-q" }, qLine));

      const opts_wrap = el("div", { class: "quiz-options" });
      const inputName = "quiz-" + group + "-" + item.idx;
      const inputType = isMulti ? "checkbox" : "radio";
      item.options.forEach((opt, oi) => {
        const id = inputName + "-" + oi;
        const inputAttrs = { type: inputType, id: id, value: String(oi) };
        // Radios share a name; checkboxes don't strictly need one but keep
        // the same attribute for CSS and querySelector grouping.
        inputAttrs.name = inputName;
        const lbl = el("label", { class: "quiz-option", for: id }, [
          el("input", inputAttrs),
          el("span", null, [opt])
        ]);
        opts_wrap.appendChild(lbl);
      });
      card.appendChild(opts_wrap);

      const status = el("p", { class: "quiz-status" }, [""]);
      const btn = el("button", { type: "button", class: "quiz-submit" }, ["Submit"]);
      card.appendChild(btn);
      card.appendChild(status);

      const inputSel = "input[type=" + inputType + "]";

      // Per-item resume: if this single item was already answered, lock it
      // and treat it as recorded so the group can complete.
      if (global.Score && typeof global.Score.isAnswered === "function"
          && global.Score.isAnswered(group, item.idx)) {
        card.querySelectorAll(inputSel).forEach(r => r.disabled = true);
        btn.disabled = true;
        status.textContent = "Answer recorded.";
        answered.add(item.idx);
      }

      btn.addEventListener("click", () => {
        let bit;
        if (isMulti) {
          const picked = Array.from(card.querySelectorAll(inputSel + ":checked"))
            .map(c => parseInt(c.value, 10));
          if (picked.length === 0) {
            status.textContent = "Pick at least one option.";
            return;
          }
          const want = item.correct.slice().sort((a, b) => a - b);
          const got  = picked.slice().sort((a, b) => a - b);
          const exact = want.length === got.length && want.every((v, k) => v === got[k]);
          bit = exact ? 1 : 0;
        } else {
          const picked = card.querySelector(inputSel + ":checked");
          if (!picked) {
            status.textContent = "Pick an option first.";
            return;
          }
          const choiceIdx = parseInt(picked.value, 10);
          bit = (choiceIdx === item.correct) ? 1 : 0;
        }
        if (global.Score && typeof global.Score[recorder] === "function") {
          global.Score[recorder](item.idx, bit);
        } else {
          console.warn("Quiz: Score." + recorder + " not available.");
        }
        // Lock the inputs + button.
        card.querySelectorAll(inputSel).forEach(r => r.disabled = true);
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
