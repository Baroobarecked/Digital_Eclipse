from crypt import methods
from flask import Blueprint, request
from flask_login import login_required
from ..models.songs import Song
from ..models.db import db
from ..forms import SongsForm

song_routes = Blueprint('songs', __name__, url_prefix='/api/songs')

# @song_routes.route('')
# @login_required
# def getSongs():
#     form = SongsForm()

#     data = request.json['album_id']

#     form['csrf_token'].data = request.cookies['csrf_token']
#     if form.validate_on_submit():
#         songs = Song.query.filter(Song.record_id == data)

#         return { 'songs': [song.to_dict() for song in songs]}

@song_routes.route('', methods=['POST'])
@login_required
def addSongs():
    data = request.json['songs']
    print('...........')
    print(data)
    print('...........')

    songs = data[0]
    album_id = data[1]
    print(songs)
    print(album_id)
    print('...........')
    form = SongsForm()

    all_sides = []
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        index = 0
        for data in songs.values():
            print(data)
            index = index + 1
            # url = data.pop(0)
            song_titles = data
            side = Song(
                record_id=album_id,
                songs=f'{song_titles}',
                side=index
            )
            db.session.add(side)
            db.session.commit()
            all_sides.append(side.to_dict())

    return { 'songs': all_sides }