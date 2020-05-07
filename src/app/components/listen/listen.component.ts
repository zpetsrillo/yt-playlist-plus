import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { PlaylistService } from 'src/app/services/playlist.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import {
  MatAutocompleteSelectedEvent,
  MatAutocomplete,
} from '@angular/material/autocomplete';

import { Song } from '../../services/song.model';

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

  player: YT.Player;

  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  filteredFruits: Observable<string[]>;
  fruits: string[] = ['Lemon'];
  allFruits: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];

  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(public playlistService: PlaylistService) {}

  ngOnInit(): void {
    this.playlistService.getPlaylist().subscribe((songs) => {
      this.songs = songs;
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
    });

    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) =>
        fruit ? this._filter(fruit) : this.allFruits.slice()
      )
    );
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

    // Add our fruit
    if ((value || '').trim()) {
      this.fruits.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.fruitCtrl.setValue(null);
  }

  remove(fruit: string): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.fruits.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allFruits.filter(
      (fruit) => fruit.toLowerCase().indexOf(filterValue) === 0
    );
  }
}
