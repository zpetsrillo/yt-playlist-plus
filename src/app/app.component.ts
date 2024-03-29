import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { PlaylistService } from './services/playlist.service';
import { YoutubeService } from './services/youtube.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(
    public authService: AuthService,
    public playlistService: PlaylistService,
    public youtubeService: YoutubeService
  ) {}
}
