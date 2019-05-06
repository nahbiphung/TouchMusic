import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { SongService } from 'src/app/services/song.service';
import * as firebase from 'firebase';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.css']
})
export class SongComponent implements OnInit, AfterContentChecked {
  imageColectionData: AngularFirestoreCollection<any>;
  imageDocumentData: AngularFirestoreDocument<any>;

  colectionData: AngularFirestoreCollection<any>;
  documentData: AngularFirestoreDocument<any>;
  data: any;
  private loadingSpinner: boolean;
  private avatar: any[];
  private isPlay: boolean;
  private videoSong: boolean;
  private cmtContent: string;
  private song: Song;
  private postComment: boolean;
  private pageIndex: number;
  private pageSize: number;
  private lowValue: number;
  private highValue: number;
  private subCmtContent: string;
  private currentUser: firebase.User;
  private currentUserRef: any;

  constructor(
    private db: AngularFirestore,
    private route: ActivatedRoute,
    private songService: SongService,
    public dialog: MatDialog) {
    this.loadingSpinner = true;
    this.isPlay = true;
    this.videoSong = false;
    this.postComment = false;
    this.pageIndex = 0;
    this.pageSize = 5;
    this.lowValue = 0;
    this.highValue = 5;
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

    const param = this.route.snapshot.paramMap.get('id');
    this.documentData = this.db.collection('Song').doc(param);
    this.documentData.valueChanges().subscribe((res) => {
      if (res) {
        this.data = res;
        this.data.comment.forEach(e => {
          e.stringPostDate = e.postDate.toDate().toLocaleString();
          if (e.subComment.length !== 0) {
            e.subComment.forEach(element => {
              element.stringPostDate = element.postDate.toDate().toLocaleString();
            });
          }
        });
      }
      this.loadingSpinner = false;
    });
    this.getCurrentUser();
  }

  ngAfterContentChecked(): void {

  }

  private getCurrentUser() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.currentUser = user;
        this.currentUserRef = this.db.collection('users').doc(this.currentUser.uid).ref;
      }
    });
  }

  private getPaginatorData(event: any) {
    if (event.pageIndex === this.pageIndex + 1) {
      this.lowValue = this.lowValue + this.pageSize;
      this.highValue = this.highValue + this.pageSize;
    } else if (event.pageIndex === this.pageIndex - 1) {
      this.lowValue = this.lowValue - this.pageSize;
      this.highValue = this.highValue - this.pageSize;
    }
    this.pageIndex = event.pageIndex;
  }

  private playSong() {
    if (this.isPlay && this.songService.audio.src !== this.data.mp3Url) {
      this.songService.playlistSong = [];
      this.songService.playlistSong.push(this.data);
      this.songService.audio.src = this.data.mp3Url;
      this.songService.audio.name = this.data.name;
      this.songService.audio.author = this.data.author;
    }
    this.isPlay = !this.isPlay;
    this.songService.PlayOrPause();
  }

  private submit() {
    const date = new Date();
    const getId = this.getIdOfComment(true);
    this.data.comment.unshift({
      commentId: getId,
      content: this.cmtContent,
      like: 0,
      postDate: date,
      subComment: [],
      userId: this.currentUser.email
    });
    this.db.collection('Song').doc(this.data.id).update(this.data).then(res => {
      this.cmtContent = '';
    });
  }

  private cancel() {
    this.cmtContent = '';
  }

  private getIdOfComment(isComment: boolean, cmtId?: number): number {
    let getId;
    if (isComment) {
      const sortCommentId = this.data.comment.sort((a, b) => {
        if (a.commentId < b.commentId) {
          return -1;
        }
        if (a.commentId > b.commentId) {
          return 1;
        }
        return 0;
      });
      if (sortCommentId.length !== 0) {
        getId = sortCommentId[sortCommentId.length - 1].commentId + 1;
      } else {
        getId = 1;
      }
      return getId;
    } else {
      let sortSubCommentId = this.data.comment.filter(e => e.commentId === cmtId);
      if (sortSubCommentId[0].subComment.length !== 0) {
        sortSubCommentId = sortSubCommentId[0].subComment.sort();
        getId = sortSubCommentId[sortSubCommentId.length - 1].subCommentId + 1;
        return getId;
      }
      return 1;
    }
  }

  private postSubComment(cmt: any) {
    const date = new Date();
    const getId = this.getIdOfComment(false, cmt.commentId);
    this.data.comment.forEach(element => {
      if (element === cmt) {
        element.subComment.unshift({
          subCommentId: getId,
          content: this.subCmtContent,
          like: 0,
          postDate: date,
          userId: this.currentUser.email
        });
      }
    });
    this.db.collection('Song').doc(this.data.id).update(this.data).then(() => {
      this.openComment(getId);
      this.subCmtContent = '';
    });
  }

  private openComment(cmtId: any) {
    const e = document.getElementById(cmtId);
    if (e.classList.contains('display-none')) {
      e.classList.remove('display-none');
      e.classList.add('d-flex');
    } else {
      e.classList.add('display-none');
      e.classList.remove('d-flex');
    }
  }

  private like(data: any, cmt: any, subcmt: any) {
    this.data.comment.forEach(element => {
      if (element === cmt) {
        element.subComment.forEach(subElement => {
          if (subElement === subcmt) {
            subElement.like = subElement.like + 1;
            console.log(subElement);
          }
        });
      }
    });
    this.db.collection('Song').doc(this.data.id).update(this.data);
  }

  private favoriteSong(data: any) {
    this.db.collection('Song').doc(this.data.id).update({
      like: firebase.firestore.FieldValue.increment(1)
    });
  }

  private addToPlaylist(data: any, p: any) {
    this.songService.playlistSong.push(data);
    p.toggle();
  }

  private toggle(p: any) {
    console.log(p);
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
}

export interface DialogData {
  currentUser: any;
  data: any;
  selector: string;
}
