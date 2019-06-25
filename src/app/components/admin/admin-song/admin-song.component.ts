import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialogConfig, MatDialog } from '@angular/material';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AdminSongService } from 'src/app/services/admin-song.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { AdminSongDetailsComponent } from './admin-song-details/admin-song-details.component';

@Component({
  selector: 'app-admin-song',
  templateUrl: './admin-song.component.html',
  styleUrls: ['./admin-song.component.scss']
})
export class AdminSongComponent implements OnInit {

  getPerformer: AngularFirestoreCollection<any>;
  getUser: AngularFirestoreCollection<any>;
  getCountry: AngularFirestoreCollection<any>;
  getAlbum: AngularFirestoreCollection<any>;
  getSong: AngularFirestoreCollection<any>;
  getSongType: AngularFirestoreCollection<any>;
  private listSong: Song[];
  public listdata: MatTableDataSource<any>;
  // tslint:disable-next-line:max-line-length
  displayedColumns: string[] = ['name', 'author', 'imageSong', 'mp3Url', 'album', 'video', 'country', 'songtype', 'performer', 'user', 'option'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public loadingSpinner: boolean;
  public searchValue: string;

  constructor(
    private songService: AdminSongService,
    private afs: AngularFirestore,
    private storage: AngularFireStorage,
    private dialog: MatDialog,
  ) {
    this.loadingSpinner = true;
   }

  ngOnInit() {
    this.getUser = this.afs.collection('users');
    this.getUser.valueChanges().subscribe(resUser => {
      this.getPerformer = this.afs.collection('Performer');
      this.getPerformer.valueChanges().subscribe(resPerformer => {
        this.getAlbum = this.afs.collection('Album');
        this.getAlbum.valueChanges().subscribe(resAlbum => {
          this.getSong = this.afs.collection('Song');
          this.getSong.snapshotChanges().subscribe(arr => {
            this.listSong = arr.map(item => {
              return {
                $key: item.payload.doc.id,
                ...item.payload.doc.data()
              } as Song;
            });
            if (this.listSong) {
              let data: any;
              for (data of this.listSong) {
                if (data.author) {
                  const arrAuthor = [];
                  for (const auth of data.author) {
                    const dataAuthor: any[] = resPerformer.filter(e => e.id === auth.id);
                    // console.log(dataPerformer);
                    arrAuthor.push(dataAuthor[0].name);
                  }
                  if (arrAuthor.length >= 2) {
                    data.authorName = arrAuthor[0] + ', ' + arrAuthor[1];
                  } else if (arrAuthor.length === 1) {
                    data.authorName = arrAuthor[0];
                  }
                }
                if (data.performerId) {
                  // const dataPerformer: any[] = resPerformer.filter(e => e.id === data.performerId.id);
                  const arrPer = [];
                  for (const per of data.performerId) {
                    const dataPerformer: any[] = resPerformer.filter(e => e.id === per.id);
                    // console.log(dataPerformer);
                    arrPer.push(dataPerformer[0].name);
                  }
                  if (arrPer.length >= 2) {
                    data.performerName = arrPer[0] + ', ' + arrPer[1];
                  } else if (arrPer.length === 1) {
                    data.performerName = arrPer[0];
                  }
                }
                if (data.albumId.id) {
                  const dataAlbum: any[] = resAlbum.filter(e => e.id === data.albumId.id);
                  data.albumName = dataAlbum[0].name;
                }
                if (data.userId.id) {
                  const dataUser: any[] = resUser.filter(e => e.uid === data.userId.id);
                  data.userName = dataUser[0].displayName;
                }
              }
            }
            this.listdata = new MatTableDataSource(this.listSong);
            this.listdata.sort = this.sort;
            this.listdata.paginator = this.paginator;
            this.listdata.filterPredicate = (data, filter) => {
              return data.name.toLowerCase().indexOf(filter) !== -1
              || data.albumName.toLowerCase().indexOf(filter) !== -1
              || data.performerName.toLowerCase().indexOf(filter) !== -1
              || data.userName.toLowerCase().indexOf(filter) !== -1;
            };
            this.loadingSpinner = false;
          });
        });
      });
    });
  }

  public applyFilter() {
    this.listdata.filter = this.searchValue.trim().toLowerCase();
  }

  public onClickClearSearch() {
    this.searchValue = '';
    this.applyFilter();
  }

  public onClickCreate() {
    this.songService.formReset();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    this.dialog.open(AdminSongDetailsComponent, dialogConfig);
  }

  private onClickEdit(element) {
    this.songService.popupForm(element);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    this.dialog.open(AdminSongDetailsComponent, dialogConfig);
  }

  private onDelete(element) {
    if (confirm('Are you sure to detele')) {
      this.songService.deleteSong(element.$key);
      this.storage.storage.refFromURL(element.mp3Url).delete();
      this.storage.storage.refFromURL(element.imageSong).delete();
      this.storage.storage.refFromURL(element.video).delete();
    }
  }
}
