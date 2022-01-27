from random import random
from flask import Blueprint, request
from flask_login import login_required

from ..models import db, Forum
from ..forms import ForumForm


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