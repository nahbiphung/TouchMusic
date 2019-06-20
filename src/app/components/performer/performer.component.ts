import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component';
import * as firebase from 'firebase';
import { SongService } from 'src/app/services/song.service';

@Component({
  selector: 'app-performer',
  templateUrl: './performer.component.html',
  styleUrls: ['./performer.component.scss']
})
export class PerformerComponent implements OnInit {

  private collectionData: AngularFirestoreCollection<any>;
  private documentData: AngularFirestoreDocument<any>;
  private data: Performer;
  private performerData: Performer[];
  public loadingSpinner: boolean;
  private songData: Playlist[];
  private albumData: Album[];
  private videoData: any[];
  private currentUserRef: any;
  private currentUser: firebase.User;
  constructor(
    private db: AngularFirestore,
    private route: ActivatedRoute,
    private songService: SongService,
    private router: Router,
    public dialog: MatDialog) {
    this.loadingSpinner = true;
  }

  ngOnInit() {
    const getParams = this.route.snapshot.paramMap.get('id');
    this.collectionData = this.db.collection('Performer');
    this.collectionData.valueChanges().subscribe((res: Performer[]) => {
      if (res) {
        this.performerData = this.shuffler(res).slice(0, 4);
        res = res.filter(e => e.id === getParams);
        this.data = res[0];
      }
    });
    this.documentData = this.db.collection('Performer').doc(getParams);
    this.documentData.snapshotChanges().subscribe((res: any) => {
      if (res) {
        this.collectionData = this.db.collection('Song', query =>
          query.where('performerId', 'array-contains', res.payload.ref));
        this.collectionData.valueChanges().subscribe((songRes: Song[]) => {
          if (songRes) {
            this.songData = [];
            this.videoData = songRes.filter(e => e.video !== '');
            this.db.collection('Performer').valueChanges().subscribe((performer: Performer[]) => {
              if (performer) {
                songRes.forEach(s => {
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
            })
          }
        });
        // this.collectionData = this.db.collection('Song', query =>
        //   query.where('author', 'array-contains', res.payload.ref));
        // this.collectionData.valueChanges().subscribe((songRes: Song[]) => {
        //   if (songRes) {
        //     this.songData = songRes;
        //     this.videoData = songRes.filter(e => e.video !== '');
        //   }
        // });
        this.collectionData = this.db.collection('Album', query =>
          query.where('performerId', '==', res.payload.ref));
        this.collectionData.valueChanges().subscribe((albumRes: Album[]) => {
          if (albumRes) {
            this.albumData = albumRes;
            console.log(albumRes);
            this.loadingSpinner = false;

          }
        });
      }
    });
    this.getCurrentUser();
  }

  private getCurrentUser() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.currentUser = user;
        this.currentUserRef = this.db.collection('users').doc(this.currentUser.uid).ref;
      }
    });
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
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };
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

  private addToPlaylist(data: any, p: any) {
    this.songService.playlistSong.push(data);
    p.toggle();
  }

  private addToFavoritePlaylist(song: Song, p: any) {
    console.log(song);
    p.toggle();
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
      this.songService.audio.author = data.author;
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
