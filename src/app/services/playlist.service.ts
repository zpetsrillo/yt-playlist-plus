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

        // this.addSong({
        //   uid: this.user.uid,
        //   watchCode: 'testing',
        //   rating: 1200,
        //   tags: { hiphop: true },
        // });
        // this.getPlaylist().subscribe((x) => {
        //   this.updateSong(x[0]);
        // });
      }
    });
  }

  private updateSongData({ uid, watchCode, rating, tags }: Song) {
    const songRef: AngularFirestoreDocument<Song> = this.afs.doc(
      `songs/${uid}.${watchCode}`
    );

    const data = {
      uid,
      watchCode,
      rating,
      tags,
    };

    return songRef.set(data, { merge: true });
  }

  public getPlaylist() {
    return this.playlist;
  }

  public addSong(song: Song) {
    this.playlistCollection.add(song);
  }

  public deleteSong(song: Song) {
    this.songDoc = this.afs.doc(`songs/${song.id}`);
    this.songDoc.delete();
  }

  public updateSong(song: Song) {
    this.songDoc = this.afs.doc(`songs/${song.id}`);
    let updatedSong: Song = {
      uid: song.uid,
      rating: song.rating,
      tags: song.tags,
      watchCode: song.watchCode,
    };
    this.songDoc.update(updatedSong);
  }
}
