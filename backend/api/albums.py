from flask import Blueprint, request
from flask_login import login_required

from ..models import db, Album, Song

album_routes = Blueprint('albums', __name__, url_prefix='/api/albums')

@album_routes.route('/<int:user_id>')
# @login_required
def getAlbums(user_id):
    '''
        Function returns an array of all the albums created by the user
    '''
    albums = Album.query.filter(Album.user_id is user_id).all()
    print(f'made it to albums....... user {user_id}')
    print(albums)
    albums_with_songs = []
    for album in albums:
        sides = Song.query.filter(Song.record_id is album.id)
        albums_with_songs.append([{'album': album.to_dict(),
                                    'sides': [side.to_dict() for side in sides]}])
    return {'albums': albums_with_songs}

@album_routes.route('', methods=['POST'])
def createAlbum():
    '''
        Function creates a new album and then returns that album
    '''
    data = request.json['album']
    print(data)
    album = Album(
        album_title=data['album_title'],
        album_cover=data['album_cover'],
        user_id=1
    )

    db.session.add(album)
    db.session.commit()
    return {'album': album.to_dict()}

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
