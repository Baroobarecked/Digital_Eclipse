import os
from flask import Flask, request, redirect
from .api.users import user_routes
from .api.albums import album_routes
from .api.uploads import upload_routes
from .api.songs import song_routes
from .api.forums import forum_routes
from backend.models.db import db
from flask_migrate import Migrate
from backend.config import Config
from flask_cors import CORS
from flask_wtf.csrf import CSRFProtect, generate_csrf
from flask_login import LoginManager
from flask_jsglue import JSGlue
from backend.models.users import User

app = Flask(__name__)
jsglue = JSGlue(app)

login = LoginManager(app)
# login.login_view = 'users.unauthorized'
login.init_app(app)

@login.user_loader
def load_user(id):
    return User.query.get(int(id))

app.register_blueprint(user_routes)
app.register_blueprint(album_routes)
app.register_blueprint(upload_routes)
app.register_blueprint(song_routes)
app.register_blueprint(forum_routes)

app.config.from_object(Config)
db.init_app(app)
Migrate(app,db)
CORS(app)


@app.before_request
def https_redirect():
    if os.environ.get('FLASK_ENV') == 'production':
        if request.headers.get('X-Forwarded-Proto') == 'http':
            url = request.url.replace('http://', 'https://', 1)
            code = 301
            return redirect(url, code=code)


@app.after_request
def inject_csrf_token(response):
    response.set_cookie(
        'csrf_token',
        generate_csrf(),
        secure=True if os.environ.get('FLASK_ENV') == 'production' else False,
        samesite='Strict' if os.environ.get(
            'FLASK_ENV') == 'production' else None,
        httponly=True)
    return response


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def react_root(path):
    if path == 'favicon.ico':
        return app.send_static_file('favicon.ico')
    return app.send_static_file('index.html')


# if __name__ == '__main__':
#   port = int(os.environ.get('PORT', 5000))
#   app.run(host='0.0.0.0', port = port)