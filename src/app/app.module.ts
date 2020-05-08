import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgxYoutubePlayerModule } from 'ngx-youtube-player';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { ListenComponent } from './components/listen/listen.component';

import { AuthService } from './services/auth.service';
import { PlaylistService } from './services/playlist.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AboutComponent } from './components/about/about.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './modules/material/material.module';
import { HomeComponent } from './components/home/home.component';

const config = {
  apiKey: 'AIzaSyBLEwGz5lDQ1DKH2GFqD3fPqnXVHFp2l6o',
  authDomain: 'song-rater.firebaseapp.com',
  databaseURL: 'https://song-rater.firebaseio.com',
  projectId: 'song-rater',
  storageBucket: 'song-rater.appspot.com',
  messagingSenderId: '923959586301',
  appId: '1:923959586301:web:9bb56c6ae3a216d8f2fd94',
};

@NgModule({
  declarations: [
    AppComponent,
    ListenComponent,
    NavbarComponent,
    AboutComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgxYoutubePlayerModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    AngularFireModule.initializeApp(config),
    AngularFirestoreModule, // firestore
    AngularFireAuthModule, // auth
    AngularFireStorageModule, // storage
  ],
  providers: [AuthService, PlaylistService],
  bootstrap: [AppComponent],
})
export class AppModule {}
