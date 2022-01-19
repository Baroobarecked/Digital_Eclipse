from flask import Flask
from .api.users import user_routes
from backend.models.db import db
from flask_migrate import Migrate
from backend.config import Config

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)
Migrate(app,db)

app.register_blueprint(user_routes)

@app.route('/')
def hello_world():
    return 'Hello'