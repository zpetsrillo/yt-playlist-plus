import { Injectable } from '@angular/core';

import { AuthService } from './auth.service';

declare var gapi: any;

@Injectable({
  providedIn: 'root',
})
export class YoutubeService {
  google: any = gapi;

  constructor(public auth: AuthService) {
    this.initClient();
  }

  initClient() {
    this.google.load('client', () => {
      this.google.client.init({
        apiKey: 'AIzaSyBLEwGz5lDQ1DKH2GFqD3fPqnXVHFp2l6o',
        clientId:
          '923959586301-ftjupjk7i5itov3nps1t13pnb1usp1tu.apps.googleusercontent.com',
        discoveryDocs: [
          'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest',
        ],
        scope: 'https://www.googleapis.com/auth/youtube.readonly',
      });

      this.google.client.load('youtube', 'v3');
    });
  }

  async getVideo(watchCode) {
    return gapi.client.youtube.videos
      .list({
        part: 'snippet',
        id: watchCode,
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
  }

  async getPlaylist(playlistId: string, pageToken?: string) {
    return gapi.client.youtube.playlistItems
      .list({
        part: 'snippet',
        pageToken: pageToken,
        playlistId: playlistId,
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
  }

  async getUserPlaylist(pageToken?: string) {
    return gapi.client.youtube.playlists
      .list({
        part: 'snippet,contentDetails',
        maxResults: 5,
        mine: true,
        pageToken: pageToken,
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
  }
}
