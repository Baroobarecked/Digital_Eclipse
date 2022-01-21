from .db import db
from flask_login import UserMixin

class User(db.Model, UserMixin):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String, nullable=False)
    last_name = db.Column(db.String)
    username = db.Column(db.String, nullable=False, unique=True)
    email = db.Column(db.String, nullable=False, unique=True)
    password = db.Column(db.String, nullable=False)
    profile_image = db.Column(db.String, nullable=False)

    albums = db.relationship("Album", back_populates="user", cascade="all, delete-orphan")
    forums = db.relationship("Forum", back_populates="user")
    posts = db.relationship("Post", back_populates="user", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'username': self.username,
            'profile_image': self.profile_image,
        }