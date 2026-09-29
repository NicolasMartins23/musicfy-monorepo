-- ALIAS = "apelido"
SELECT 
	artist.id AS id_artista,
	album.id as id_album,
	artist.name as artista,
	album.name as album
FROM music_api_artist artist
INNER JOIN music_api_album album ON (album.artist_id = artist.id)
where artist.id > 10


SELECT 
artist.id as T_ARTIST_COL_ID,
album.id as T_ALBUM_COL_ID,
song.album_id as T_SONG_COL_ALBUM_ID,
song.id as T_SONG_COL_ID,
*
FROM music_api_artist artist
INNER JOIN music_api_album album ON (artist.id = album.artist_id)
INNER JOIN music_api_song song ON (album.id = song.album_id)
									
