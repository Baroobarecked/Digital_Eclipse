from flask import Blueprint, request, session, url_for, render_template, g, flash, redirect
from werkzeug.security import check_password_hash, generate_password_hash
from backend import app
from ..models.users import User
from ..models.db import db

user_routes = Blueprint('users', __name__, url_prefix='/api/users')

@user_routes.route('/')
def testing():
    return 'hello again'

@user_routes.route('/signup', methods=['POST'])
def sign_up():
    '''
        This function takes in user input, validates it, then creates a new user.
    '''
    [first_name, last_name, username, email, password, profile_image] = request.json.user
    error = []

    if not first_name:
        error.append('A first name is required')
    elif not username:
        error.append('A username is required')
    elif not email:
        error.append('An email is required')
    elif not password:
        error.append('A password is required')
    
    if not error:
        try:
            new_user = User(first_name=first_name, 
                            last_name=last_name,
                            username=username,
                            email=email,
                            password=generate_password_hash(password),
                            profile_image=profile_image)
            db.session.add(new_user)
            db.session.commit()
        except db.session.IntegrityError:
            error.append('Username or email already exists')
        else: 
            return new_user.to_dict()
    return error
    
with app.test_request_context('/api/users/signup', data={'user': ['Aaron', 'Brubeck',
                                                        'ajbru', 'aaron@aaron.com',
                                                        'password', 'https://bl3302files.storage.live.com/y4mxB3XcxesiCtNVukzEyo-Yw1PBr9X-wsmQ9yXGDWBg8gjxG1alKrQCXsAS5Srr7JMZlgtN7zD17XhiUVitUhBHwuI1wdljs64c5lqA1MpQYz6BUzeobLoBet7notP3YNmPKlZE3ruYmleY149HTM-Far7HEP7I9CNNgtaGCz-2QinInLrmyuVKpogRmiFF3zK?width=3024&height=4032&cropmode=none']}):
    sign_up()