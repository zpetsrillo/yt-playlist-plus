import { Injectable } from '@angular/core';

import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { Song } from './song.model';
import { User } from './user.model';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class PlaylistService {
  playlistCollection: AngularFirestoreCollection<Song>;
  playlist: Observable<Song[]>;
  songDoc: AngularFirestoreDocument<Song>;

  user: User;

  constructor(private afs: AngularFirestore, public auth: AuthService) {
    auth.getUser().subscribe((val) => {
      this.user = val;

      if (this.user) {
        this.noFilter();
      }
    });
  }

  private updateSongData({ uid, watchCode, tags }: Song) {
    const songRef: AngularFirestoreDocument<Song> = this.afs.doc(
      `songs/${uid}.${watchCode}`
    );

    const data = {
      uid,
      watchCode,
      tags,
    };

    return songRef.set(data, { merge: true });
  }

  public getPlaylist() {
    return this.playlist;
  }

  public addSong(watchCode: string) {
    const newSong = {
      uid: this.user.uid,
      watchCode,
      tags: [],
    };
    this.playlistCollection.add(newSong);
  }

  public deleteSong(song: Song) {
    this.songDoc = this.afs.doc(`songs/${song.id}`);
    this.songDoc.delete();
  }

  public updateSong(song: Song) {
    this.songDoc = this.afs.doc(`songs/${song.id}`);
    let updatedSong: Song = {
      uid: song.uid,
      tags: song.tags,
      watchCode: song.watchCode,
    };
    this.songDoc.update(updatedSong);
  }

  public applyFilter(tag: string) {
    this.playlistCollection = this.afs.collection<Song>(`songs`, (ref) =>
      ref.where('uid', '==', this.user.uid).where(`tags`, 'array-contains', tag)
    );

    this.playlist = this.playlistCollection.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((a) => {
          const data = a.payload.doc.data() as Song;
          data.id = a.payload.doc.id;
          return data;
        });
      })
    );
  }

  public noFilter() {
    this.playlistCollection = this.afs.collection<Song>(`songs`, (ref) =>
      ref.where('uid', '==', this.user.uid)
    );

    this.playlist = this.playlistCollection.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((a) => {
          const data = a.payload.doc.data() as Song;
          data.id = a.payload.doc.id;
          return data;
        });
      })
    );
  }
}
