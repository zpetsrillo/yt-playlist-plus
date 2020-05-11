import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from './user.model';

declare var gapi: any;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<User>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {
    this.initClient();
    this.user$ = this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  async googleSignin() {
    const googleAuth = gapi.auth2.getAuthInstance();
    const googleUser = await googleAuth.signIn();

    const token = googleUser.getAuthResponse().id_token;

    const credential = auth.GoogleAuthProvider.credential(token);

    const info = await this.afAuth.signInWithCredential(credential);
    // const provider = new auth.GoogleAuthProvider();
    // const credential = await this.afAuth.signInWithPopup(provider);
    this.router.navigate(['/listen']);
    return this.updateUserData(info.user);
  }

  async signOut() {
    await this.afAuth.signOut();
    return this.router.navigate(['/']);
  }

  private updateUserData({ uid, email, displayName }: User) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(
      `users/${uid}`
    );

    const data = {
      uid,
      email,
      displayName,
    };

    return userRef.set(data, { merge: true });
  }

  public getUser() {
    return this.user$;
  }

  initClient() {
    gapi.load('client', () => {
      console.log('loaded client');

      gapi.client.init({
        apiKey: 'AIzaSyBLEwGz5lDQ1DKH2GFqD3fPqnXVHFp2l6o',
        clientId:
          '923959586301-ftjupjk7i5itov3nps1t13pnb1usp1tu.apps.googleusercontent.com',
        discoveryDocs: [
          'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest',
        ],
        scope: 'https://www.googleapis.com/auth/youtube.readonly',
      });

      gapi.client.load('youtube', 'v3');
    });
  }

  async getVideo() {
    const video = await gapi.client.youtube.subscriptions
      .list({
        part: 'snippet,contentDetails',
        mine: true,
      })
      .then(
        function (response) {
          // Handle the results here (response.result has the parsed body).
          console.log('Response', response);
        },
        function (err) {
          console.error('Execute error', err);
        }
      );

    console.log(video);
  }
}
