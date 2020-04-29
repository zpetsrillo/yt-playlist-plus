import { Injectable } from '@angular/core';

import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Song } from './song.model';
import { User } from './user.model';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class PlaylistService {
  playlist$: AngularFirestoreCollection<Song[]>;
  user: User;

  constructor(private afs: AngularFirestore, public auth: AuthService) {
    auth.user$.subscribe((val) => {
      this.user = val;

      this.playlist$ = this.afs.collection<Song[]>(`songs`, (ref) =>
        ref.where('uid', '==', this.user.uid)
      );

      this.playlist$.valueChanges().subscribe((val) => console.log(val));
      // this.updateSongData({
      //   uid: this.user.uid,
      //   watchCode: 'testing',
      //   rating: 1800,
      //   tags: { happy: true },
      // });
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
}
