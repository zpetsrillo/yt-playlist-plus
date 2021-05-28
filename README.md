# PlaylistPlus

## Summary
Platform for listening to YouTube playlists with extended functionality such as playlist collaboration, filtering, and working shuffle.

## Motivation
When using YouTube to listen to music, I found that the shuffle feature would often loop on the same group of songs. This along with some other annoyances of YouTube pushed me towards using Spotify. Spotify however also has issues such as the inability to collaborate on playlists.

## Site layout
- Home
	- Sign up
	- What is PlaylistPlus
- About
	- Description of site
	- Donate link
- Listen
	- User playlists
	- Songs
- Browse/Search
	- Songs
	- Playlists
	- Users

## Database Structure
### Users
- uid
	- email
	- displayName
	- uid
- playlists
	- playlistId
	- title

### Songs
- watchCode
	- songInfo
	- collectiveTags

### Playlists
- playlistId
	- title
	- owner
	- permissions
- watchCode
	- songInfo
	- playlistSpecificTags

## Features
### Playlists
Store songs into playlists for convent listening. Songs in a playlist can be tagged to allow for easy filtering. Users should be able to filter a playlist by multiple tags at a time. Playlists should have the option to be public or private. Users should have the option to create multiple playlists.

### Shuffle options
Multiple shuffle options such as:
- true random
- random without repeat
- queue

### Playlist collaboration
Grant permission to other users for access to view or moderate playlists.

### Tag filtering
Allow for users to place tags on individual songs. Using these tags playlists can then be filtered to dynamically alter a playlists based on short term listening preference. For example if someone was feeling down they might filter for all of their songs labeled as 'sad' or 'slow'. Users should also be able to filter for multiple tags at once.

## Song import
Add song to playlist by input of YouTube watch code or URL.

## Search
Search through songs and playlists that have already been added to PlaylistPlus. Users should also be able to find popular songs based on tags. Search can also be used to find other users to look up music that your friends are listening to if they have made their playlist public.

## Playlist import
Allows users the ability to import existing playlists from YouTube into PlaylistPlus. Users should be prompted upon creating an account to import one of their existing playlists. Allow option to apply a tag to all songs that are imported with a playlist. This could also be used to merge a playlist from YouTube into a playlist on PlaylistPlus.

## API
### Playlist
- Song order
- Queue
- Filter
	- Tags
	- Keyword
- Current song

### Database
- CRUD Song
- CRUD Playlist
- Authorization

### YouTube GAPI
- Get song
- Get playlist
- Get user playlist

### YouTube Player
- Change song
- Play/Pause
- Skip
- Time controls

