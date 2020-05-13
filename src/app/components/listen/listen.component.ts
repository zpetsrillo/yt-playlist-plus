import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { PlaylistService } from 'src/app/services/playlist.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { map, startWith, min } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import {
  MatAutocompleteSelectedEvent,
  MatAutocomplete,
} from '@angular/material/autocomplete';

import { Song } from '../../services/song.model';
import { YoutubeService } from 'src/app/services/youtube.service';

@Component({
  selector: 'app-listen',
  templateUrl: './listen.component.html',
  styleUrls: ['./listen.component.css'],
})
export class ListenComponent implements OnInit {
  songs: Song[];
  tagCounts: any;
  videoUrl: any;
  currentSong: Song;
  watchCode: string;
  inputWatchCode: string;

  player: any;

  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new FormControl();
  filteredTags: Observable<string[]>;
  tags: string[];
  allTags: string[];

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(
    public playlistService: PlaylistService,
    public youtubeService: YoutubeService
  ) {}

  ngOnInit(): void {
    this.playlistService.getPlaylist().subscribe((songs) => {
      this.songs = songs;
      if (!this.currentSong) {
        this.currentSong = this.songs[
          Math.floor(Math.random() * this.songs.length)
        ];

        const tagCounts = {};
        for (let song of this.songs) {
          for (let tag of song.tags) {
            tagCounts[tag] = tagCounts[tag] + 1 || 1;
          }
        }
        this.tagCounts = tagCounts;
        this.allTags = Object.keys(tagCounts);
        if (this.currentSong) {
          this.tags = this.currentSong.tags;
        }
      }
    });

    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) =>
        tag ? this._filter(tag) : this.allTags.slice()
      )
    );
  }

  // Run on initial player load
  savePlayer(player: any) {
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
  playVideo(player: any, watchCode: string) {
    player.cueVideoById(watchCode);
    player.playVideo();
  }

  // Play a random video
  playRandomVideo() {
    this.playVideo(this.player, this.getRandomWatchCode());
  }

  // Return random watch code from playlist
  getRandomWatchCode() {
    let nextWatchCode: string;
    let nextSong: Song;
    do {
      nextSong = this.songs[Math.floor(Math.random() * this.songs.length)];
      nextWatchCode = nextSong.watchCode;
    } while (
      nextWatchCode == this.currentSong.watchCode &&
      this.songs.length != 1
    );
    this.currentSong = nextSong;
    this.tags = this.currentSong.tags;
    return nextWatchCode;
  }

  // Add new song to playlist in database
  addSong() {
    if (-1 != this.inputWatchCode.search(/[><]+/)) {
      this.inputWatchCode = '';
    }
    if (this.inputWatchCode) {
      let code: string;
      const re: RegExp = /youtube\.com\/watch\?v=([^&]+)($|&)/;

      try {
        code = re.exec(this.inputWatchCode)[1];
      } catch (error) {
        code = this.inputWatchCode;
      }

      this.playlistService.addSong(code);
      if (!this.songs) {
        this.playRandomVideo();
      }
      this.inputWatchCode = '';
    }
  }

  // Remove current song from the user's playlist
  removeSong() {
    this.playlistService.deleteSong(this.currentSong);
    this.playRandomVideo();
  }

  filterByTag(tag: string) {
    if (tag) {
      this.playlistService.applyFilter(tag);
    } else {
      this.playlistService.noFilter();
    }
    this.playlistService.getPlaylist().subscribe((songs) => {
      this.songs = songs;
      if (tag && !this.currentSong.tags.includes(tag)) {
        this.playRandomVideo();
      }
    });
  }

  add(event): void {
    const input = event.input;
    const value = event.value;

    // Add our tag
    if ((value || '').trim()) {
      this.tags.push(value.trim());

      this.tagCounts[value.trim()] += 1;
      this.allTags = Object.keys(this.tagCounts);

      this.updateSong();
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.tagCtrl.setValue(null);
  }

  remove(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);

      if (this.tagCounts[tag.trim()] > 0) {
        this.tagCounts[tag.trim()] = this.tagCounts[tag.trim()] - 1;
      } else {
        delete this.tagCounts[tag.trim()];
        const allTagsIndex = this.allTags.indexOf(tag);

        if (allTagsIndex >= 0) {
          this.allTags.splice(allTagsIndex, 1);
        }
      }

      this.updateSong();
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const tag = event.option.viewValue;
    this.tags.push(tag);
    this.tagInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);

    this.tagCounts[tag] += 1;
    this.allTags = Object.keys(this.tagCounts);

    this.updateSong();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allTags.filter(
      (tag) => tag.toLowerCase().indexOf(filterValue) === 0
    );
  }

  updateSong() {
    const updatedSong = this.currentSong;
    updatedSong.tags = this.tags;
    this.playlistService.updateSong(updatedSong);
    this.currentSong = updatedSong;
    this.tags = this.currentSong.tags;
  }

  padZero(num) {
    if (num < 10) {
      return `0${num}`;
    }
    return num;
  }

  getVideoInfo() {
    this.youtubeService.getVideo(this.currentSong.watchCode);
  }
}
