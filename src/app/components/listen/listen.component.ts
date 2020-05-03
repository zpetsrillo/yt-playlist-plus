import { Component, OnInit } from '@angular/core';
import { PlaylistService } from 'src/app/services/playlist.service';

import { Song } from '../../services/song.model';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-listen',
  templateUrl: './listen.component.html',
  styleUrls: ['./listen.component.css'],
})
export class ListenComponent implements OnInit {
  songs: Song[];
  videoUrl: any;

  constructor(
    public playlistService: PlaylistService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.playlistService.getPlaylist().subscribe((songs) => {
      this.songs = songs;

      const watchCode = this.songs[0].watchCode;
      const dangerousVideoUrl = 'https://www.youtube.com/embed/' + watchCode;
      this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        dangerousVideoUrl
      );
    });
  }
}
