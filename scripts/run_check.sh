#!/bin/bash
# run_check.sh -- run one headless-Chrome check with a free port, at most three at a time.
#
#   scripts/run_check.sh scripts/check_lesson19_numbers.js
#   scripts/run_check.sh scripts/check_layout.js lesson3.html lesson4.html
#
# Several sessions (or agents) checking at once would otherwise share a port and a probe file, and a loaded
# machine makes a number check miss its time budget. This takes one of three slots (flock), gives the check
# that slot's PORT, and sets CHROME when it is not set: Google Chrome on a Mac, else a Chromium on the PATH
# or Playwright's (with --no-sandbox, which a container's root user needs).
set -u
cd "$(dirname "$0")/.."
if [ -z "${CHROME:-}" ]; then
  if [ -x "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" ]; then
    CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  else
    BIN="$(command -v chromium || command -v chromium-browser || command -v google-chrome || echo /opt/pw-browsers/chromium)"
    WRAP="${TMPDIR:-/tmp}/evo_chrome_wrap.sh"
    printf '#!/bin/sh\nexec "%s" --no-sandbox "$@"\n' "$BIN" > "$WRAP.$$" && chmod +x "$WRAP.$$" && mv "$WRAP.$$" "$WRAP"
    CHROME="$WRAP"
  fi
fi
export CHROME
LOCKDIR="${TMPDIR:-/tmp}/evo_check_slots"; mkdir -p "$LOCKDIR"
while true; do
  for slot in 1 2 3; do
    exec 9>"$LOCKDIR/slot$slot"
    if flock -n 9; then
      PORT=$((8900 + slot)) node "$@"; code=$?
      exit $code
    fi
  done
  sleep 5
done
