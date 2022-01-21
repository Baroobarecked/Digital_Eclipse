from .db import db

class Album(db.Model):
    __tablename__ = 'albums'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    album_title = db.Column(db.String, nullable=False)
    album_cover = db.Column(db.String, nullable=False)
    release_date = db.Column(db.Date)

    user = db.relationship("User", back_populates="albums")
    songs = db.relationship("Song", back_populates="album", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'album_title': self.album_title,
            'album_cover': self.album_cover
        }