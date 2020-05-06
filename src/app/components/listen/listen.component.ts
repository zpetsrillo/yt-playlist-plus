import { Component, OnInit } from '@angular/core';
import { PlaylistService } from 'src/app/services/playlist.service';

import { Song } from '../../services/song.model';

@Component({
  selector: 'app-listen',
  templateUrl: './listen.component.html',
  styleUrls: ['./listen.component.css'],
})
export class ListenComponent implements OnInit {
  songs: Song[];
  videoUrl: any;
  currentSong: Song;
  watchCode: string;
  inputWatchCode: string;

  player: YT.Player;

  constructor(public playlistService: PlaylistService) {}

  ngOnInit(): void {
    this.playlistService.getPlaylist().subscribe((songs) => {
      this.songs = songs;
      this.currentSong = this.songs[
        Math.floor(Math.random() * this.songs.length)
      ];
    });
  }

  // Run on initial player load
  savePlayer(player: YT.Player) {
    this.player = player;
    this.playVideo(this.player, this.currentSong.watchCode);
  }

  // Run on player state change
  onStateChange(event) {
    // Event 0 is video end
    if (event.data == 0) {
      // Play a random video from playlist
      this.playRandomVideo();
    }
  }

  // Play video for given player
  playVideo(player: YT.Player, watchCode: string) {
    player.cueVideoById(watchCode);
    player.playVideo();
  }

  // Play a random video
  playRandomVideo() {
    this.playVideo(this.player, this.getRandomWatchCode());
  }

  // Return random watch code from playlist
  getRandomWatchCode() {
    let nextWatchCode: string = this.currentSong.watchCode;
    let nextSong: Song;
    while (
      nextWatchCode == this.currentSong.watchCode &&
      this.songs.length > 1
    ) {
      nextSong = this.songs[Math.floor(Math.random() * this.songs.length)];
      nextWatchCode = nextSong.watchCode;
    }
    this.currentSong = nextSong;
    return nextWatchCode;
  }

  // Add new song to playlist in database
  addSong() {
    if (this.inputWatchCode) {
      this.playlistService.addSong(this.inputWatchCode);
      this.inputWatchCode = '';
    }
  }

  // Remove current song from the user's playlist
  removeSong() {
    this.playlistService.deleteSong(this.currentSong);
    this.playRandomVideo();
  }
}
