import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogComponent, FavoriteList } from '../dialog/dialog.component';
import * as firebase from 'firebase';
import { SongService } from 'src/app/services/song.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  private collectionData: AngularFirestoreCollection<any>;
  private documentData: AngularFirestoreDocument<any>;
  private favoriteData: FavoriteList[];
  private performerData: Performer[];
  public loadingSpinner: boolean;
  private songData: Playlist[];
  private albumData: Album[];
  private videoData: any[];
  private currentUserRef: any;
  private currentUser: firebase.User;
  private text: string;
  constructor(
    private db: AngularFirestore,
    private route: ActivatedRoute,
    private songService: SongService,
    private router: Router,
    public dialog: MatDialog) {
    this.loadingSpinner = true;
  }

  ngOnInit() {
    const getParams = this.route.snapshot.paramMap.get('keyword');
    this.text = getParams;
    this.collectionData = this.db.collection('Performer', query => query.where('name', '==', getParams));
    this.collectionData.valueChanges().subscribe((res: Performer[]) => {
      if (res) {
        this.performerData = res;
        console.log('performer' + res);
      }
    });
    this.collectionData = this.db.collection('Song', query => query.where('name', '==', getParams));
    this.collectionData.valueChanges().subscribe((song: Song[]) => {
      if (song) {
        this.songData = [];
        this.videoData = song.filter(e => e.video !== '');
        this.db.collection('Performer').valueChanges().subscribe((performer: Performer[]) => {
          if (performer) {
            song.forEach(s => {
              let listAuthor = [];
              if (s.author.length > 0) {
                s.author.forEach(p => {
                  listAuthor = listAuthor.concat(performer.filter(per => per.id === p.id));
                });
              }
              this.songData.push({
                id: s.id,
                name: s.name,
                author: listAuthor,
                mp3Url: s.mp3Url,
                like: s.like,
                view: s.view,
              });
            });
          }
        });
      }
    });
    this.collectionData = this.db.collection('Album', query => query.where('name', '==', getParams));
    this.collectionData.valueChanges().subscribe((res: Album[]) => {
      if (res) {
        this.albumData = res;
        console.log('album' + res);
      }
    });
    this.collectionData = this.db.collection('FavoritePlaylist', query => query.where('name', '==', getParams));
    this.collectionData.valueChanges().subscribe((res: FavoriteList[]) => {
      if (res) {
        this.favoriteData = res;
        console.log('FAvoritelist' + res);
        this.loadingSpinner = false;
      }
    });
    this.getCurrentUser();
  }

  private openVideo(songVideo: Song) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '70vw',
      data: { currentUser: '', data: songVideo, selector: 'D' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      console.log('The dialog was closed');
    });
  }

  private getCurrentUser() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.currentUser = user;
        this.currentUserRef = this.db.collection('users').doc(this.currentUser.uid).ref;
      }
    });
  }

  private shuffler(data: any): any[] {
    let ctr = data.length;
    let temp;
    let index;

    while (ctr > 0) {
      index = Math.floor(Math.random() * ctr);
      ctr--;
      temp = data[ctr];
      data[ctr] = data[index];
      data[index] = temp;
    }
    return data;
  }

  private changePerformer(per: Performer) {
    this.router.navigate(['/performer/' + per.id]);
  }

  private gotoSong(song: Song) {
    this.router.navigate(['/song/' + song.name + '/' + song.id]);
  }

  private favoriteSong(data: any) {
    const like = document.getElementById('like');
    if (!like.classList.contains('color-organe')) {
      this.db.collection('Song').doc(data.id).update({
        like: firebase.firestore.FieldValue.increment(1)
      }).then(() => {
        like.classList.add('color-organe');
      });
    } else {
      like.classList.remove('color-organe');
    }
  }

  private addToPlaylist(data: any) {
    this.songService.playlistSong.push(data);
  }

  private addToFavoritePlaylist(song: Song) {
    console.log(song);
    const dialogRef = this.dialog.open(DialogComponent, {
      height: '78vh',
      width: '70vw',
      data: { currentUser: this.currentUserRef, data: song, selector: 'C' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      console.log('The dialog was closed');
    });
  }

  private playSong(data: Song) {
    if (!this.songService.isPlay && this.songService.audio.src !== data.mp3Url) {
      this.songService.playlistSong = [];
      this.songService.playlistSong.push(data);
      this.songService.audio.src = data.mp3Url;
      this.songService.audio.name = data.name;
      let authors = '';
      data.author.forEach(child => {
        authors = authors + child.name + ' ';
      });
      this.songService.audio.author = authors;
    }
    this.songService.PlayOrPause();
  }
}

export interface DialogData {
  currentUser: any;
  data: any;
  selector: string;
}

export interface Playlist {
  id: string;
  name: string;
  author: Array<any>;
  mp3Url: string;
  view: number;
  like: number;
}
