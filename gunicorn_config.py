import os

workers = int(os.environ.get('GUNICORN_PROCESSES', '2'))
threads = int(os.environ.get('GUNICORN_THREADS', '8'))
timeout = int(os.environ.get('GUNICORN_TIMEOUT', '10'))
bind = os.environ.get('GUNICORN_BIND', '0.0.0.0:1338')
forwarded_allow_ips = '*'
secure_scheme_headers = { 'X-Forwarded-Proto': 'https' }
ssl_version = 3
