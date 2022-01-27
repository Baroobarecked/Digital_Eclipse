import os
from flask import Blueprint, request
from flask_login import login_required

from ..models import db, Forum, Post, User
from ..forms import ForumForm, PostForm
from flask_socketio import SocketIO, emit, join_room, leave_room

if os.environ.get("FLASK_ENV") == "production":
    origins = [
        "http://digital-eclipse.herokuapp.com",
        "https://digital-eclipse.herokuapp.com"
    ]
else:
    origins = "*"

socketio = SocketIO(cors_allowed_origins=origins)


forum_routes = Blueprint('forum_routes', __name__, url_prefix='/api/forums')

@forum_routes.route('')
def get_discussions():

    # skip = random.randint(1, 4)
    discussions = Forum.query.limit(10)

    return {'discussions': [discussion.to_dict() for discussion in discussions]}

@forum_routes.route('', methods=['POST'])
@login_required
def add_discussion():
    form = ForumForm()

    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        print('in here')
        data = request.json

        forum = Forum(
            forum_title=data['forum_title'],
            admin=data['admin']
        )

        db.session.add(forum)
        db.session.commit()

        return {'discussion': forum.to_dict()}

@forum_routes.route('', methods=['DELETE'])
@login_required
def delete_discussion():
    forum_id = request.json['forum_id']

    forum = Forum.query.get_or_404(forum_id)

    db.session.delete(forum)
    db.session.commit()

    return {'message': 'delete successful'}

@forum_routes.route('/<int:forum_id>')
def get_posts(forum_id):
    posts = Post.query.filter(Post.forum_id == forum_id).all()
    posts_and_users = []
    if posts:
        for post in posts:
            user = User.query.get_or_404(post.user_id)
            print(user)
            posts_and_users.append([post.to_dict(), user.username, user.profile_image])
        return {'posts': posts_and_users}
    return { 'message': 'post failed'}

@socketio.on('join_discussion')
def join(data):
    room = data['discussion']
    join_room(f'discussion {room}')

@socketio.event
def post(data):
    updated_Info = [data['0'], data['1'], data['2']]
    post = data['0']
    forum_id = post['forum_id']
    print(post)
    emit("post", updated_Info, to=f'discussion {forum_id}')

@socketio.event
def post_edit(data):
    print(data)
    post = data['post']
    forum_id = post['forum_id']
    emit("post_edit", post, to=f'discussion {forum_id}')

@socketio.event
def post_delete(data):
    print(data)
    id = data['postId']
    forum_id = data['discussionId']
    emit("post_delete", id, to=f'discussion {forum_id}')


@forum_routes.route('/<int:forum_id>', methods=['POST'])
@login_required
def add_post(forum_id):
    form = PostForm()

    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        data = request.json
        user = data['user']
        post = Post(
            user_id=user['id'],
            content=data['content'],
            forum_id=forum_id
        )

        db.session.add(post)
        db.session.commit()

        return post.to_dict()