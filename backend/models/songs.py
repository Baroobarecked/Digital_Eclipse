from .db import db

class Song(db.Model):
    __tablename__ = 'songs'

    id = db.Column(db.Integer, primary_key=True)
    record_id = db.Column(db.Integer, db.ForeignKey('albums.id'), nullable=False)
    songs = db.Column(db.String, nullable=False)
    side = db.Column(db.Integer, nullable=False)

    album = db.relationship("Album", back_populates='songs')