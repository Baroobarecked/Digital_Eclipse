from flask import Blueprint, request
from flask_login import login_required

from ..models import db, Album, Song
from ..forms import AlbumsForm

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
    form = AlbumsForm()

    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        album = Album(
            album_title=data['album_title'],
            album_cover=data['album_cover'],
            user_id=data['user_id']
        )

        db.session.add(album)
        db.session.commit()
        return {'album': album.to_dict()}

@album_routes.route('', methods=['PUT'])
@login_required
def updateAlbum():
    '''
        Function updates an album and returns the updated album
    '''

    data = request.json['album']


    form = AlbumsForm()

    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():

        album = Album.query.get_or_404(data['id'])

        album.album_title = data['album_title']
        album.album_cover = data['album_cover']
        album.user_id = data['user_id']

        db.session.commit()

        return {'album': album.to_dict()}

@album_routes.route('', methods=['DELETE'])
@login_required
def deleteAlbum():
    '''
        Function deletes and album and returns a success message
    '''
    data = request.json['album_id']

    form = AlbumsForm()

    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        album = Album.query.get_or_404(data)
        print(f'...................{data}{album}')

        db.session.delete(album)
        db.session.commit()
        return { 'message': 'deleted' }

@album_routes.route('/<int:album_id>/songs')
@login_required
def getSongs(album_id):
    
    songs = Song.query.filter(Song.record_id == album_id).all()
    return { 'songs': [song.to_dict() for song in songs]}
