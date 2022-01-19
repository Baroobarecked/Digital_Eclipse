from flask import Blueprint, request, session, url_for, render_template, g, flash, redirect
from werkzeug.security import check_password_hash, generate_password_hash
from flask_login import current_user, login_user, logout_user, login_required

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
    [first_name, last_name, username, email, password, profile_image] = request.json['user']
    error = []
    
    if not first_name:
        error.append('A first name is required')
    if not username:
        error.append('A username is required')
    if not email:
        error.append('An email is required')
    if not password:
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
            login_user(new_user)
        except:
            error.append('Username or email already exists')
        else: 
            return new_user.to_dict()
    return { 'errors': error }
    
# @user_routes.route('/login')

@user_routes.route('/unauthorized')
def unauthorized():
    """
    Returns unauthorized JSON when flask-login authentication fails
    """
    return {'errors': ['Unauthorized']}, 401