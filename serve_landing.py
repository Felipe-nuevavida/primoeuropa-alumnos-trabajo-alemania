from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler

if __name__ == '__main__':
    server = ThreadingHTTPServer(('0.0.0.0', 4173), SimpleHTTPRequestHandler)
    print('Serving landing on http://0.0.0.0:4173')
    server.serve_forever()
