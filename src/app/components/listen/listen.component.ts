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
  watchCode: string;

  player: YT.Player;

  constructor(public playlistService: PlaylistService) {}

  ngOnInit(): void {
    this.playlistService.getPlaylist().subscribe((songs) => {
      this.songs = songs;
      this.watchCode = this.songs[0].watchCode;
    });
  }

  savePlayer(player) {
    this.player = player;
    this.player.playVideo();
  }

  onStateChange(event) {
    if (event.data == 0) {
      this.player.cueVideoById('OWuDln36Weo');
      this.player.playVideo();
    }
  }
}
