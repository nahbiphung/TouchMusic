import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { SongService } from 'src/app/services/song.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase';
import { UserDetailsComponent } from '../admin/user-details/user-details.component';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss']
})
export class PlaylistComponent implements OnInit {
  collectionData: AngularFirestoreCollection<any>;
  documentData: AngularFirestoreDocument<any>;
  imageColectionData: AngularFirestoreCollection<any>;
  imageDocumentData: AngularFirestoreDocument<any>;
  public loadingSpinner: boolean;
  private avatar: any[];
  private verifyUser: boolean;
  private playlistSong = [];
  private country: Country;
  private albumInfo: Album;
  private favoritePlaylist: any;
  private isPlay: boolean;
  private videoSong: boolean;
  private isAlbum: boolean;
  private isFavorite: boolean;
  private isCountry: boolean;
  private userData: User;
  private performer: Performer;
  constructor(private db: AngularFirestore, public songService: SongService, private route: ActivatedRoute) {
    this.loadingSpinner = true;
    this.isPlay = true;
    this.videoSong = false;
    this.isAlbum = false;
    this.isFavorite = false;
    this.isCountry = false;
    this.verifyUser = false;
   }

  ngOnInit() {
    this.imageColectionData = this.db.collection('imagesForView');
    this.imageColectionData.valueChanges().subscribe((res) => {
      if (res) {
        this.avatar = res[0];
      }
      this.loadingSpinner = false;
    }, (error) => {
      console.log('error');
      this.loadingSpinner = false;
    });


    // get playlist
    const getDetectRoute = this.route.snapshot.url[1].path;
    const getParams = this.route.snapshot.paramMap.get('id');
    if (getDetectRoute === 'favoritePlaylist') {
      this.documentData = this.db.collection('FavoritePlaylist').doc(getParams);
      this.documentData.valueChanges().subscribe((res: FavoriteList) => {
        if (res) {
          this.playlistSong = res.details;
          this.favoritePlaylist = res;
        }
        this.db.doc(this.favoritePlaylist.userId.path).valueChanges().subscribe((userData: User) => {
          if (userData) {
            this.userData = userData;
            this.verifyUserAuthenicate(userData);
            this.isFavorite = true;
          }
        });
      }, (error) => {
        console.log('error');
      });

    } else if (getDetectRoute === 'album') {
      // get album info
      this.documentData = this.db.collection('Album').doc(getParams);
      this.documentData.valueChanges().subscribe((res: Album) => {
        if (res) {
          this.albumInfo = res;
        }
        this.db.doc(res.performerId).valueChanges().subscribe((performer: Performer) => {
          if (performer) {
            this.performer = performer;
          }
        });
      });
      // get song in album
      this.collectionData = this.db.collection('Song',
        que => que.where('albumId', '==', getParams));
      this.collectionData.valueChanges().subscribe((res: Song[]) => {
        if (res) {
          this.playlistSong = res;
        }
      }, (error) => {
        console.log('error');
      });
    } else if (getDetectRoute === 'country') {
      // get country
      this.collectionData = this.db.collection('Country', query => query.where('name', '==', getParams));
      this.collectionData.valueChanges().subscribe((res: Country[]) => {
        if (res) {
          this.country = res[0];
          this.isCountry = true;
        }
        // get country reference
        const refCountry = this.db.collection('Country').doc(this.country.id).ref;
        // get song in country
        this.collectionData = this.db.collection('Song',
          que => que.where('countryId', '==', refCountry));
        this.collectionData.valueChanges().subscribe((res: Song[]) => {
          if (res) {
            this.playlistSong = res;
          }
        }, (error) => {
          console.log('error');
        });
      }, (error) => {
        console.log(error);
      });
    }
  }

  private verifyUserAuthenicate(userData: any) {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        if (user.uid === userData.uid) {
          this.verifyUser = true;
        }
      }
    });
  }

  private onClickSong(data: any) {
    this.songService.playSong(data);
    this.songService.audio.src = data.mp3Url;
    this.songService.audio.name = data.name;
    this.songService.audio.author = data.author;
    this.songService.audio.load();
    this.songService.isPlay = true;
    this.songService.PlayOrPause();
  }

  private addAllToPlaylist() {
    this.songService.playlistSong = this.playlistSong;
  }

  private drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.playlistSong, event.previousIndex, event.currentIndex);
  }

  private selectedAction() {
    this.songService.playlistSong = this.playlistSong;
    this.isPlay = !this.isPlay;
    this.songService.PlayOrPause();
  }


}
