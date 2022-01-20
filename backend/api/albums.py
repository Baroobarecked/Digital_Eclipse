from crypt import methods
from flask import Blueprint, request
from flask_login import login_required

album_routes = Blueprint('albums', __name__, url_prefix='/api/albums')

@album_routes.route('/')
def getAlbums():
    '''
        Function returns an array of all the albums created by the user
    '''
    pass

@album_routes.route('/', methods=['POST'])
def createAlbum():
    '''
        Function creates a new album and then returns that album
    '''
    pass

@album_routes.route('/', methods=['PATCH'])
def updateAlbum():
    '''
        Function updates an album and returns the updated album
    '''
    pass

@album_routes.route('/', methods=['DELETE'])
def deleteAlbum():
    '''
        Function deletes and album and returns a success message
    '''
    pass
