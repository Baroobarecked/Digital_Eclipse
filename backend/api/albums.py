from flask import Blueprint, request
from flask_login import login_required

from ..models import db, Album, Song
from ..forms import SongsForm

album_routes = Blueprint('albums', __name__, url_prefix='/api/albums')

@album_routes.route('/<int:user_id>')
@login_required
def getAlbums(user_id):
    '''
        Function returns an array of all the albums created by the user
    '''
    albums = Album.query.filter(Album.user_id == user_id).all()
    print(f'made it to albums....... user {user_id}')
    print(albums)
    # albums_with_songs = []
    # for album in albums:
    #     sides = Song.query.filter(Song.record_id is album.id)
    #     albums_with_songs.append([{'album': album.to_dict(),
    #                                 'sides': [side.to_dict() for side in sides]}])
    # print(albums_with_songs)
    return {'albums': [album.to_dict() for album in albums]}

@album_routes.route('', methods=['POST'])
@login_required
def createAlbum():
    '''
        Function creates a new album and then returns that album
    '''
    data = request.json['album']
    print(data)
    album = Album(
        album_title=data['album_title'],
        album_cover=data['album_cover'],
        user_id=data['user_id']
    )

    db.session.add(album)
    db.session.commit()
    return {'album': album.to_dict()}

@album_routes.route('/', methods=['PATCH'])
@login_required
def updateAlbum():
    '''
        Function updates an album and returns the updated album
    '''
    pass

@album_routes.route('/', methods=['DELETE'])
@login_required
def deleteAlbum():
    '''
        Function deletes and album and returns a success message
    '''
    pass

@album_routes.route('/<int:album_id>/songs')
@login_required
def getSongs(album_id):
    
    songs = Song.query.filter(Song.record_id == album_id).all()
    print('................before')
    print(songs)
    return { 'songs': [song.to_dict() for song in songs]}
