from flask import Blueprint, request
from werkzeug.security import check_password_hash, generate_password_hash
from flask_login import current_user, login_user, logout_user
from ..models.users import User
from ..models.db import db
from ..forms import SignUpForm, LoginForm

user_routes = Blueprint('users', __name__, url_prefix='/api/users')

@user_routes.route('/')
def authenticate():
    """
    Authenticates a user.
    """
    if current_user.is_authenticated:
        return current_user.to_dict()
    return {'errors': ['Unauthorized']}

@user_routes.route('/signup', methods=['POST'])
def sign_up():
    '''
        This function takes in user input, validates it, then creates a new user.
    '''
    [first_name, last_name, username, email, password, profile_image] = request.json['user']
    error = []

    form = SignUpForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
    
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
    else:
        return {'error': 'invalid csrf'}
    
@user_routes.route('/login', methods=['POST'])
def login(): 
    '''
        This function checks user login information and if valid creates a session.
    '''
    [username, password] = request.json['user']

    error = []

    form = LoginForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():

        user = User.query.filter(User.username == username).first()
        if user is None:
            error.append('Username or password incorrect')
        elif not check_password_hash(user.password, password):
            error.append('Username or password incorrect')

        if not error:
            login_user(user)
            return user.to_dict()
        else:
            return {'errors': error}
    else:
        return {'error': 'invalid csrf'}

@user_routes.route('/logout')
def logout():
    """
    Logs a user out
    """
    logout_user()
    return {'message': 'User logged out'}

@user_routes.route('/unauthorized')
def unauthorized():
    """
    Returns unauthorized JSON when flask-login authentication fails
    """
    return {'errors': ['Unauthorized']}, 401