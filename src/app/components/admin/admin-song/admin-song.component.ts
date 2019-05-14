import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

@Component({
  selector: 'app-admin-song',
  templateUrl: './admin-song.component.html',
  styleUrls: ['./admin-song.component.scss']
})
export class AdminSongComponent implements OnInit {

  getSong: AngularFirestoreCollection<any>;
  private listSong: Song[];
  private listdata: MatTableDataSource<any>;
  displayedColumns: string[] = ['image', 'name', 'option'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  private searchValue: string;

  constructor(
    private afs: AngularFirestore,
  ) { }

  ngOnInit() {
    this.getSong = this.afs.collection('Song');
    this.getSong.snapshotChanges().subscribe(arr => {
      this.listSong = arr.map(item => {
        return {
          $key: item.payload.doc.id,
          ...item.payload.doc.data()
        } as Song;
      });
      this.listdata = new MatTableDataSource(this.listSong);
      this.listdata.sort = this.sort;
      this.listdata.paginator = this.paginator;
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
