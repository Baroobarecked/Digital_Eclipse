from .db import db

class Post(db.Model):
    __tablename__ = "posts"

    id = db.Column(db.Integer, primary_key=True)
    forum_id = db.Column(db.Integer, db.ForeignKey('forums.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)

    user = db.relationship("User", back_populates="posts")
    forum = db.relationship("Forum", back_populates="posts")

    def to_dict(self):
        return {
            'id': self.id,
            'forum_id': self.forum_id,
            'user_id': self.user_id,
            'content': self.content
        }