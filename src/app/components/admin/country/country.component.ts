import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { CountryService } from '../../../services/country.service';
import { MatTableDataSource } from '@angular/material';
import { MatDialog, MatDialogConfig, MatSort, MatPaginator } from '@angular/material';
import { CountryDetailComponent } from './country-detail/country-detail.component';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss']
})
export class CountryComponent implements OnInit {

  getCountry: AngularFirestoreCollection<any>;
  private listCountry: Country[];
  private listdata: MatTableDataSource<any>;
  displayedColumns: string[] = ['image', 'name', 'option'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  private searchValue: string;

  constructor(
    private afs: AngularFirestore,
    private countryService: CountryService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.getCountry = this.afs.collection('Country');
    this.getCountry.snapshotChanges().subscribe(arr => {
      this.listCountry = arr.map(item => {
        return {
          $key: item.payload.doc.id,
          ...item.payload.doc.data()
        } as Country;
      });
      this.listdata = new MatTableDataSource(this.listCountry);
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
    this.countryService.formReset();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    this.dialog.open(CountryDetailComponent, dialogConfig);
  }

  private onClickEdit(element) {
    this.countryService.popupForm(element);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    this.dialog.open(CountryDetailComponent, dialogConfig);
  }

  private onDelete(element) {
    if (confirm('Are you want to delete?')) {
      this.countryService.deleteCountry(element.$key);
    }
  }
}
