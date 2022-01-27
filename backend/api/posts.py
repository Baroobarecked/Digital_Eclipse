from flask import Blueprint, request
from flask_login import login_required

from ..models import db, Post
from ..forms import PostForm


post_routes = Blueprint('post_routes', __name__, url_prefix='/api/posts')

@post_routes.route('', methods=['PUT'])
@login_required
def edit_post():


    form = PostForm()

    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        data = request.json['post']['post']
        print(data)

        post = Post.query.get_or_404(data['id'])

        post.content = data['content']

        db.session.commit()

        return {'post': post.to_dict()}

@post_routes.route('', methods=['DELETE'])
@login_required
def delete_post():
    post_id = request.json['post_id']

    post = Post.query.get_or_404(post_id)

    db.session.delete(post)
    db.session.commit()

    return {'message': 'delete successful'}