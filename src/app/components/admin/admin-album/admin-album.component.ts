import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialogConfig, MatDialog } from '@angular/material';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { AdminAlbumService } from '../../../services/admin-album.service';
import { AdminAlbumDetailsComponent } from './admin-album-details/admin-album-details.component';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-admin-album',
  templateUrl: './admin-album.component.html',
  styleUrls: ['./admin-album.component.scss']
})
export class AdminAlbumComponent implements OnInit {

  getUser: AngularFirestoreCollection<any>;
  getPerformer: AngularFirestoreCollection<any>;
  getAlbum: AngularFirestoreCollection<any>;
  private listAlbum: Album[];
  private listdata: MatTableDataSource<any>;
  displayedColumns: string[] = ['name', 'image', 'performer', 'user', 'option'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  private searchValue: string;
  public loadingSpinner: boolean;

  constructor(
    private afs: AngularFirestore,
    private albumService: AdminAlbumService,
    private dialog: MatDialog,
    private storage: AngularFireStorage
  ) {
    this.loadingSpinner = true;
  }

  ngOnInit() {
    this.getUser = this.afs.collection('users');
    this.getUser.valueChanges().subscribe(resUser => {
      this.getPerformer = this.afs.collection('Performer');
      this.getPerformer.valueChanges().subscribe(resPerformer => {
        this.getAlbum = this.afs.collection('Album');
        this.getAlbum.snapshotChanges().subscribe(arr => {
          this.listAlbum = arr.map(item => {
            return {
              $key: item.payload.doc.id,
              ...item.payload.doc.data()
            } as Album;
          });
          if (this.listAlbum) {
            let data: any;
            for (data of this.listAlbum) {
              if (data.userId.id) {
                const dataUser: any[] = resUser.filter(e => e.uid === data.userId.id);
                data.userName = dataUser[0].displayName;
              }
              if (data.performerId.id) {
                const dataPerformer: any[] = resPerformer.filter(e => e.id === data.performerId.id);
                data.performerName = dataPerformer[0].name;
              }
            }
          }
          this.listdata = new MatTableDataSource(this.listAlbum);
          this.listdata.sort = this.sort;
          this.listdata.paginator = this.paginator;
          this.listdata.filterPredicate = (data, filter) => {
            return data.name.toLowerCase().indexOf(filter) !== -1
            || data.userName.toLowerCase().indexOf(filter) !== -1
            || data.performerName.toLowerCase().indexOf(filter) !== -1;
          };
          this.loadingSpinner = false;
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
    this.albumService.formReset();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    this.dialog.open(AdminAlbumDetailsComponent, dialogConfig);
  }

  private onClickEdit(element) {
    this.albumService.popupForm(element);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    this.dialog.open(AdminAlbumDetailsComponent, dialogConfig);
  }

  private onDelete(element) {
    if (confirm('Are you sure to detele')) {
      this.albumService.deleteAlbum(element.$key);
      this.storage.storage.refFromURL(element.image).delete();
    }
  }
}
