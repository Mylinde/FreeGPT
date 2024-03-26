import orjson
import secrets
import os
import flask
import subprocess

from flask_caching import Cache
from flask_compress import Compress
from server.bp import bp
from server.website import Website
from server.backend import Backend_Api
from server.babel import create_babel

app = flask.Flask(__name__)
compress = Compress(app)
config = orjson.loads(open('config.json', 'r').read())
site_config = config['site_config']
url_prefix = config.pop('url_prefix')

cache = Cache(app, config={'CACHE_TYPE': 'redis', 'CACHE_REDIS_HOST': 'localhost', 'CACHE_REDIS_PORT': 6379, 'CACHE_DEFAULT_TIMEOUT': 10})

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

def start_redis():
        try:
            subprocess.run(["redis-server", "--cluster-enabled", "1"], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        except FileNotFoundError: raise Exception("Redis server package not found. Please install Redis server before running this application.")

        if __name__ == "__main__":
            try: # Check if Redis is running 
                subprocess.run(["redis-cli", "ping"], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            except subprocess.CalledProcessError: start_redis()
  
        if "GUNICORN_ARGV" in dict(os.environ):
            run_with_gunicorn = True
        else:
            run_with_gunicorn = False

        if run_with_gunicorn:
        
            from gunicorn.app.base import Application
            Application(app).run()

        else:
            print(f"Running on {site_config['port']}{url_prefix}")
            app.run(**site_config)
            print(f"Closing port {site_config['port']}")
