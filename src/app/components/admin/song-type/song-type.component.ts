import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { MatTableDataSource, MatSort, MatPaginator, MatDialogConfig, MatDialog } from '@angular/material';
import { SongTypeService } from '../../../services/song-type.service';
import { SongTypeDetailComponent } from './song-type-detail/song-type-detail.component';

@Component({
  selector: 'app-song-type',
  templateUrl: './song-type.component.html',
  styleUrls: ['./song-type.component.scss']
})
export class SongTypeComponent implements OnInit {

  getSongType: AngularFirestoreCollection<any>;
  private listSongType: SongType[];
  public listdata: MatTableDataSource<any>;
  displayedColumns: string[] = ['name', 'option'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public searchValue: string;

  constructor(
    private afs: AngularFirestore,
    private songtypeService: SongTypeService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.getSongType = this.afs.collection('SongType');
    this.getSongType.snapshotChanges().subscribe(arr => {
      this.listSongType = arr.map(item => {
        return{
          $key: item.payload.doc.id,
          ...item.payload.doc.data()
        } as SongType;
      });
      this.listdata = new MatTableDataSource(this.listSongType);
      this.listdata.sort = this.sort;
      this.listdata.paginator = this.paginator;
      this.listdata.filterPredicate = (data, filter) => {
        return data.name.toLowerCase().indexOf(filter) !== -1;
      };
    });
  }

  applyFilter() {
    this.listdata.filter = this.searchValue.trim().toLowerCase();
  }

  private onClickClearSearch() {
    this.searchValue = '';
    this.applyFilter();
  }

  onClickCreate() {
    this.songtypeService.formReset();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    this.dialog.open(SongTypeDetailComponent, dialogConfig);
  }

  private onClickEdit(element) {
    this.songtypeService.popupForm(element);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    this.dialog.open(SongTypeDetailComponent, dialogConfig);
  }

  private onDelete(element) {
    if (confirm('Are you want to delete?')) {
      this.songtypeService.deleteSongType(element.$key);
    }
  }
}
