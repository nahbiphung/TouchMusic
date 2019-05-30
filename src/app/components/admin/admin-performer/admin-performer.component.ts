import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatDialogConfig } from '@angular/material';
import { PerformerService } from '../../../services/performer.service';
import { AdminPerformerDetailsComponent } from './admin-performer-details/admin-performer-details.component';

@Component({
  selector: 'app-admin-performer',
  templateUrl: './admin-performer.component.html',
  styleUrls: ['./admin-performer.component.scss']
})
export class AdminPerformerComponent implements OnInit {

  private getPerformer: AngularFirestoreCollection<any>;
  private getCountry: AngularFirestoreCollection<any>;
  private listPerformer: any[];
  public listdata: MatTableDataSource<any>;
  displayedColumns: string[] = ['birthday', 'country', 'countryname', 'name', 'option'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public searchValue: string;
  private countryName: string;

  constructor(
    private afs: AngularFirestore,
    private performerService: PerformerService,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.getCountry = this.afs.collection('Country');
    this.getCountry.valueChanges().subscribe(res => {
      this.getPerformer = this.afs.collection('Performer');
      this.getPerformer.snapshotChanges().subscribe(arr => {
        this.listPerformer = arr.map(item => {
          return {
            $key: item.payload.doc.id,
            ...item.payload.doc.data()
          } as Performer;
        });
        if (this.listPerformer) {
          let data: any;
          for (data of this.listPerformer) {
            if (data.birthday) {
              if (data.birthday.seconds) {
                data.birthday = data.birthday.toDate();
              }
            } else {
              // data.birthday = new Date(Date.now());
            }
            if (data.countryId.id) {
              const dataCountry: any[] = res.filter(e => e.id === data.countryId.id);
              data.countryName = dataCountry[0].name;
            }
          }
        }
        this.listdata = new MatTableDataSource(this.listPerformer);
        this.listdata.sort = this.sort;
        this.listdata.paginator = this.paginator;
        // TODO: filter must search CountryName
        this.listdata.filterPredicate = (data, filter) => {
          return data.name.toLowerCase().indexOf(filter) !== -1
            || data.birthday.toString().toLowerCase().indexOf(filter) !== -1
            || data.countryName.toLowerCase().indexOf(filter) !== -1;
        };
      });
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
    this.performerService.formReset();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    this.dialog.open(AdminPerformerDetailsComponent, dialogConfig);
  }

  private onClickEdit(element) {
    this.performerService.popupForm(element);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    this.dialog.open(AdminPerformerDetailsComponent, dialogConfig);
  }

  private onDelete(element) {
    if (confirm('Are you want to delete?')) {
      this.performerService.deletePerformer(element.$key);
    }
  }

}
