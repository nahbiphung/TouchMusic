import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';

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
  private listSong: Song[];
  private listdata: MatTableDataSource<any>;
  displayedColumns: string[] = ['name', 'imageSong', 'mp3Url', 'album', 'video', 'country', 'performer', 'user', 'option'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  private searchValue: string;

  constructor(
    private afs: AngularFirestore,
  ) { }

  ngOnInit() {
    this.getUser = this.afs.collection('users');
    this.getUser.valueChanges().subscribe(resUser => {
      this.getPerformer = this.afs.collection('Performer');
      this.getPerformer.valueChanges().subscribe(resPerformer => {
        this.getCountry = this.afs.collection('Country');
        this.getCountry.valueChanges().subscribe(resCountry => {
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
                  if (data.performerId.id) {
                    const dataPerformer: any[] = resPerformer.filter(e => e.id === data.performerId.id);
                    data.performerName = dataPerformer[0].name;
                  }
                  if (data.countryId.id) {
                    const dataCountry: any[] = resCountry.filter(e => e.id === data.countryId.id);
                    data.countryName = dataCountry[0].name;
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
                || data.countryName.toLowerCase().indexOf(filter) !== -1
                || data.performerName.toLowerCase().indexOf(filter) !== -1
                || data.userName.toLowerCase().indexOf(filter) !== -1;
              };
            });
          });
        });
      });
    });
  }

  private applyFilter() {
    this.listdata.filter = this.searchValue.trim().toLowerCase();
  }

  private onClickClearSearch() {
    this.searchValue = '';
    this.applyFilter();
  }

  private onClickCreate() {

  }

  private onClickEdit(element) {

  }

  private onDelete(element) {

  }
}
