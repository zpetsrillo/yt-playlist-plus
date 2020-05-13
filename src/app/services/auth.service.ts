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
  google: any = gapi;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {
    // this.initClient();
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
    const googleAuth = this.google.auth2.getAuthInstance();
    const googleUser = await googleAuth.signIn();

    const token = googleUser.getAuthResponse().id_token;

    const credential = auth.GoogleAuthProvider.credential(token);

    const info = await this.afAuth.signInWithCredential(credential);

    this.router.navigate(['/listen']);
    return this.updateUserData(info.user);
  }

  async signOut() {
    const auth2 = this.google.auth2.getAuthInstance();
    auth2.signOut().then(async () => {
      await this.afAuth.signOut();
      auth2.disconnect();
    });
    this.router.navigate(['/']);
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
}
