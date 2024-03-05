import orjson
import secrets
from server.bp import bp
from server.website import Website
from server.backend import Backend_Api
from server.babel import create_babel
from flask import Flask
from flask_compress import Compress

if __name__ == '__main__':
    # Load configuration from config.json
    config = orjson.loads(open('config.json', 'r').read())
    site_config = config['site_config']
    url_prefix = config.pop('url_prefix')

    # Create the app
    app = Flask(__name__)
    compress = Compress(app)
    app.secret_key = secrets.token_hex(16)

    # Set up Babel
    create_babel(app)

    # Set up the website routes
    site = Website(bp, url_prefix)
    for route in site.routes:
        bp.add_url_rule(
            route,
            view_func=site.routes[route]['function'],
            methods=site.routes[route]['methods'],
        )

    # Set up the backend API routes
    backend_api = Backend_Api(bp, config)
    for route in backend_api.routes:
        bp.add_url_rule(
            route,
            view_func=backend_api.routes[route]['function'],
            methods=backend_api.routes[route]['methods'],
        )

    # Register the blueprint
    app.register_blueprint(bp, url_prefix=url_prefix)

    # Run the Flask server
    print(f"Running on {site_config['port']}{url_prefix}")
    app.run(**site_config)
    print(f"Closing port {site_config['port']}")

