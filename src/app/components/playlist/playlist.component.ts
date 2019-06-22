import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { SongService } from 'src/app/services/song.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase';
import { UserDetailsComponent } from '../admin/user-details/user-details.component';
import { MatDialog } from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component';

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
  constructor(
    private db: AngularFirestore,
    public songService: SongService,
    private route: ActivatedRoute,
    public dialog: MatDialog) {
    this.loadingSpinner = true;
    this.isPlay = true;
    this.videoSong = false;
    this.isAlbum = false;
    this.isFavorite = false;
    this.isCountry = false;
    this.verifyUser = false;
    this.playlistSong = [];
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
      this.documentData.valueChanges().subscribe(async (res: FavoriteList) => {
        if (res) {
          this.playlistSong = [];
          if (res.details.length > 0) {
            res.details.forEach((s) => {
              this.documentData = this.db.collection('Song').doc(s);
              this.documentData.valueChanges().subscribe(async (song) => {
                const listAuthor = [];
                if (song.author.length > 0) {
                  let i = 0;
                  while (i < song.author.length) {
                    this.documentData = this.db.collection('Performer').doc(song.author[i].id);
                    const t = await this.documentData.valueChanges().subscribe(auth => {
                      listAuthor.push({
                        id: auth.id,
                        name: auth.name,
                      });
                    });
                    i++;
                  }
                }
                this.playlistSong.push({
                  id: song.id,
                  name: song.name,
                  author: listAuthor,
                  mp3Url: song.mp3Url
                });
              });
            });
          }
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
      this.documentData.valueChanges().subscribe(async (res: Album) => {
        if (res) {
          this.albumInfo = res;
        }
        await this.db.doc(res.performerId).valueChanges().subscribe((performer: Performer) => {
          if (performer) {
            this.performer = performer;
            this.isAlbum = true;
          }
        });
      });
      // get song in album
      this.collectionData = this.db.collection('Song',
        que => que.where('albumId', '==', this.documentData.ref));
      this.collectionData.valueChanges().subscribe((song: Song[]) => {
        if (song) {
          this.db.collection('Performer').valueChanges().subscribe((author: Performer[]) => {
            if (author) {
              song.forEach(s => {
                let listauthor = [];
                if (s.author.length > 0) {
                  s.author.forEach(a => {
                    listauthor = listauthor.concat(author.filter(auth => auth.id === a.id));
                  });
                }
                this.playlistSong.push({
                  id: s.id,
                  name: s.name,
                  author: listauthor,
                  mp3Url: s.mp3Url,
                });
              });
            }
          });
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
          que => que.where('country', '==', res[0].name));
        this.collectionData.valueChanges().subscribe((song: Song[]) => {
          if (song) {
            this.db.collection('Performer', query => query.where('countryId', '==', refCountry))
              .valueChanges().subscribe((listAuth: Performer[]) => {
              if (listAuth) {
                song.forEach((s) => {
                  let listauthor = [];
                  if (s.author.length > 0) {
                    s.author.forEach((ea: any) => {
                      listauthor = listauthor.concat(listAuth.filter(a => a.id === ea.id));
                    });
                  }
                  this.playlistSong.push({
                    id: s.id,
                    name: s.name,
                    author: listauthor,
                    mp3Url: s.mp3Url
                  });
                });
              }
            });

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

  private editPlaylist() {
    const faPlaylist = {
      id: this.favoritePlaylist.id,
      name : this.favoritePlaylist.name,
      image: this.favoritePlaylist.image,
      details: this.playlistSong
    };
    const dialogRef = this.dialog.open(DialogComponent, {
      height: '78vh',
      width: '50vw',
      data: {data: faPlaylist, selector: 'EDIT_FAPLAYLIST' }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      console.log('The dialog was closed');
    });
  }

  private onClickSong(data: any) {
    this.songService.playSong(data);
    this.songService.audio.src = data.mp3Url;
    this.songService.audio.name = data.name;
    let authors = '';
    data.author.forEach(element => {
      authors = authors + element.name + ' ';
    });
    this.songService.audio.author = authors;
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
    const newPlaylist =[];
    this.playlistSong.forEach(element => {
      let authors = '';
      element.author.forEach(child => {
        authors = authors + child.name + ' ';
      });
      newPlaylist.push({
        id: element.id,
        name: element.name,
        author: authors,
        mp3Url: element.mp3Url
      });
    });
    this.songService.playlistSong = newPlaylist;
    this.isPlay = !this.isPlay;
    this.songService.PlayOrPause();
  }

  private addToPlaylist(data: any) {
    this.songService.playlistSong.push(data);
  }

  private addToFavoritePlaylist(data: any) {
    this.db.collection('Song').doc(data.id).update({
      like: firebase.firestore.FieldValue.increment(1)
    });
  }
}

export interface SongForPlaylist {
  name: string;
  author: [{
    name: string;
  }];
}
