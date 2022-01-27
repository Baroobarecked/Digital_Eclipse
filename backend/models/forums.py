from .db import db

class Forum(db.Model):
    __tablename__ = 'forums'

    id = db.Column(db.Integer, primary_key=True)
    forum_title = db.Column(db.String, nullable=False)
    admin = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    user = db.relationship("User", back_populates="forums")
    posts = db.relationship("Post", back_populates="forum", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'forum_title': self.forum_title,
            'admin': self.admin
        }