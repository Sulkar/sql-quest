#!/usr/bin/env python3

import http.server
import os

os.chdir("./")
port = 8081
print("Webseite kann unter folgender URL aufgerufen werden: http://localhost:8081/")

http.server.SimpleHTTPRequestHandler.extensions_map[".wasm"] = "application/wasm"

httpd = http.server.HTTPServer(
    ("localhost", port), http.server.SimpleHTTPRequestHandler
)

print(
    'Mapping ".wasm" to "%s"'
    % http.server.SimpleHTTPRequestHandler.extensions_map[".wasm"]
)
httpd.serve_forever()