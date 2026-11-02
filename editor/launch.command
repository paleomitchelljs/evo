#!/bin/bash
# Double-click this file in Finder to start the lesson editor. It opens a Terminal window, starts the server, and
# points the browser at its home page. Ctrl-C in the Terminal window stops it.

set -e
cd "$(dirname "$0")/.."

PORT="${EVO_EDITOR_PORT:-8770}"
URL="http://127.0.0.1:${PORT}/"

echo "Starting the lesson editor at ${URL} ..."
echo "(Press Ctrl-C to stop. This window can be closed afterwards.)"
echo

( sleep 1 && open "${URL}" ) &

exec python3 editor/server.py --port "${PORT}"
