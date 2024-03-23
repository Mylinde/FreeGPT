import argparse
import orjson
import secrets
import os
import flask

from server.bp import bp
from server.website import Website
from server.backend import Backend_Api
from server.babel import create_babel
from flask_compress import Compress

config = orjson.loads(open('config.json', 'r').read())
site_config = config['site_config']
url_prefix = config.pop('url_prefix')

app = flask.Flask(__name__)
compress = Compress(app)
app.secret_key = secrets.token_hex(16)
create_babel(app)

site = Website(bp, url_prefix)
for route in site.routes:
    bp.add_url_rule(
        route,
        view_func=site.routes[route]['function'],
        methods=site.routes[route]['methods'],
    )

backend_api = Backend_Api(bp, config)
for route in backend_api.routes:
    bp.add_url_rule(
        route,
        view_func=backend_api.routes[route]['function'],
        methods=backend_api.routes[route]['methods'],
    )

app.register_blueprint(bp, url_prefix=url_prefix)

def run():
    print(f"Running on {site_config['port']}{url_prefix}")
    app.run(**site_config)
    print(f"Closing port {site_config['port']}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Start the server")
    parser.add_argument("-p", "--port", type=int, default=site_config["port"],
                        help="Port number (default: %(default)d)")
    parser.add_argument("-b", "--host", default="0.0.0.0",
                        help="Host address (default: %(default)s)")
    arguments = parser.parse_args()

    if __name__ == "__main__":
        parser = argparse.ArgumentParser(description="Start the server")
        parser.add_argument("-p", "--port", type=int, default=site_config["port"],
                            help="Port number (default: %(default)d)")
        parser.add_argument("-b", "--host", default="0.0.0.0",
                            help="Host address (default: %(default)s)")

        arguments = parser.parse_args()
    
        if "GUNICORN_ARGV" in dict(os.environ):
            run_with_gunicorn = True
            os.environ.pop("GUNICORN_ARGV")
            port = int(os.getenv("PORT", site_config["port"]))
            host = os.getenv("HOST", "0.0.0.0")
        else:
            run_with_gunicorn = False

        if run_with_gunicorn:
            print("Running with Gunicorn...")
            print(f"Host: {host}")
            print(f"Port: {port}")

            from gunicorn.app.wsgiapp import WSGIApplication
            options = {
                'bind': f'{host}:{port}',
                'workers': 1,
                'reload': False,
            }

            WSGIApplication(app).run(**options)
        else:
            app.run(**arguments.__dict__)
