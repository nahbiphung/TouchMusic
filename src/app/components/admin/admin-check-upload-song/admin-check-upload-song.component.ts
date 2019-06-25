import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatDialogConfig } from '@angular/material';
import { AngularFireStorage } from '@angular/fire/storage';
import { Playlist } from '../../search/search.component';
import { DialogComponent } from '../../dialog/dialog.component';

@Component({
  selector: 'app-admin-check-upload-song',
  templateUrl: './admin-check-upload-song.component.html',
  styleUrls: ['./admin-check-upload-song.component.scss']
})
export class AdminCheckUploadSongComponent implements OnInit, OnDestroy {

  collectionData: AngularFirestoreCollection<any>;
  documentData: AngularFirestoreDocument<any>;
  private listdata: MatTableDataSource<any>;
  private listSongDataUncheck: any[];
  private storeData: any[];
  private isPlay: boolean;
  private audio: any;
  private duration: number;
  private curTime: number;
  public loadingSpinner: boolean;

  displayedColumns: string[] = ['name', 'imageSong', 'author', 'performerId', 'user', 'option'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  private searchValue: string;
  constructor(
    private afs: AngularFirestore,
    private dialog: MatDialog,
    private db: AngularFirestore,
  ) {
    this.isPlay = false;
    this.audio = new Audio();
    this.loadingSpinner = true;
  }

  ngOnInit() {
    this.collectionData = this.db.collection('Performer');
    this.collectionData.valueChanges().subscribe(async (performer: Performer[]) => {
      if (performer) {
        this.collectionData = this.db.collection('userUploadSong');
        await this.collectionData.valueChanges().subscribe((song) => {
          this.listSongDataUncheck = [];
          this.storeData = song;
          if (song) {
            song.forEach((s) => {
              let listauthor = [];
              let listperformer = [];
              if (s.author.length > 0) {
                s.author.forEach(element => {
                  listauthor = listauthor.concat(performer.filter(p => p.id === element.id));
                  if (!element.id) {
                    listauthor.push({ name: element });
                  }
                });
              }
              if (s.performerId.length > 0) {
                s.performerId.forEach(element => {
                  listperformer = listperformer.concat(performer.filter(p => p.id === element.id));
                  if (!element.id) {
                    listperformer.push({ name: element });
                  }
                });
              }
              this.listSongDataUncheck.push({
                id: s.id,
                name: s.name,
                imageSong: s.imageSong,
                performerId: listperformer,
                author: listauthor,
                albumId: s.albumId.id,
                country: s.country,
                songType: s.songType,
                mp3Url: s.mp3Url,
                video: s.video,
                imageVideo: s.imageVideo,
                lyric: s.lyric,
                user: s.userId.id
              });
            });
          }
          this.loadingSpinner = false;
          this.listdata = new MatTableDataSource(this.listSongDataUncheck);
          this.listdata.sort = this.sort;
          this.listdata.paginator = this.paginator;
          this.listdata.filterPredicate = (data, filter) => {
            return data.name.toLowerCase().indexOf(filter) !== -1;
          };
        });
      }
    });
  }

  ngOnDestroy() {
    this.audio.pause();
    this.audio = new Audio();
  }

  private onAccept(data: any) {
    const song = this.storeData.filter(s => s.id === data.id);
    delete song[0].status;
    this.db.collection('Song').doc(data.id).set(song[0]);
    this.db.collection('userUploadSong').doc(data.id).delete();
    this.audio = new Audio();
  }

  private onReject(data: any) {
    const song = this.storeData.filter(s => s.id === data.id);
    this.db.collection('userUploadSong').doc(data.id).update({
      status: 'fail',
    });
    this.audio = new Audio();
  }

  private onCheckFileMp3(data: any) {
    const song = this.storeData.filter(s => s.id === data.id);
    this.onplaySong(song[0]);
  }

  private onCheckFileMp4(data: any) {
    this.audio.pause();
    const song = this.storeData.filter(s => s.id === data.id);
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '70vw',
      data: { currentUser: '', data: song[0], selector: 'D' }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.audio.play();
    });
  }

  private onplaySong(data: any) {
    this.audio.src = data.mp3Url;
    this.audio.name = data.name;
    this.audio.load();
    this.isPlay = true;
    this.onSelectPlayOrPauseSong();
  }
  private onSelectPlayOrPauseSong() {
    if (this.audio.paused) {
      if (this.audio.src) {
        this.audio.play();
        this.isPlay = true;
      }
    } else {
      this.audio.pause();
      this.isPlay = false;
    }
    this.audio.addEventListener('timeupdate', () => {
      const cur = document.getElementById('curTime-nav');
      const dur = document.getElementById('durTime-nav');
      this.curTime = this.audio.currentTime;
      this.duration = (this.audio.currentTime / this.audio.duration) * 100;
      if (this.audio.currentTime && this.audio.duration) {
        this.timeUpdateForPlayer(cur, dur);
      }
      if (this.audio.ended) {
        this.audio.pause();
        this.isPlay = this.isPlay;
      }
    });
  }
  public timeUpdateForPlayer(cur: any, dur: any) {
    const getTime = (this.audio.currentTime / this.audio.duration) * 100;
    let curMin = Math.floor(this.audio.currentTime / 60).toString();
    // tslint:disable-next-line:radix
    let curSec = Math.floor(this.audio.currentTime - parseInt(curMin) * 60).toString();
    let durMin = Math.floor(this.audio.duration / 60).toString();
    // tslint:disable-next-line:radix
    let durSec = Math.floor(this.audio.duration - parseInt(durMin) * 60).toString();
    // tslint:disable-next-line:radix
    if (parseInt(curMin) < 10) {
      curMin = '0' + curMin;
    }
    // tslint:disable-next-line:radix
    if (parseInt(curSec) < 10) {
      curSec = '0' + curSec;
    }
    // tslint:disable-next-line:radix
    if (parseInt(durMin) < 10) {
      durMin = '0' + durMin;
    }
    // tslint:disable-next-line:radix
    if (parseInt(durSec) < 10) {
      durSec = '0' + durSec;
    }

    cur.innerHTML = curMin + ':' + curSec;
    dur.innerHTML = durMin + ':' + durSec;
  }

  private moveCurrentTime(event: any) {
    this.audio.currentTime = (event.value / 100) * this.audio.duration;
  }

  private moveCurrentVolume(event: any) {
    this.audio.volume = (event.value);
  }
}
