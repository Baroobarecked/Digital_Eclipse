from flask import Blueprint, request
from flask_login import login_required

from ..models import db, Post
from ..forms import PostForm


post_routes = Blueprint('post_routes', __name__, url_prefix='/api/posts')

@post_routes.route('', methods=['DELETE'])
@login_required
def delete_discussion():
    post_id = request.json['post_id']

    post = Post.query.get_or_404(post_id)

    db.session.delete(post)
    db.session.commit()

    return {'message': 'delete successful'}