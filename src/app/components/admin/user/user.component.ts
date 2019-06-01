import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { MatTableDataSource } from '@angular/material';
import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA, MatSort, MatPaginator } from '@angular/material';
import { UserDetailsComponent } from '../user-details/user-details.component';
import { UserService } from '../../../services/user.service';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  getUserCol: AngularFirestoreCollection<any>;
  private listUser: User[];
  public listdata: MatTableDataSource<any>;
  // tslint:disable-next-line:max-line-length
  displayedColumns: string[] = ['email', 'firstName', 'lastName', 'displayName', 'photoURL', 'phone', 'birthday', 'roleAdmin', 'roleSubscriber', 'option'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public searchValue: string;

  constructor(
    private afs: AngularFirestore,
    private dialog: MatDialog,
    private userService: UserService,
    private storage: AngularFireStorage,
    ) { }

  ngOnInit() {
    this.userService.getUsers();

    this.getUserCol = this.afs.collection('users');
    this.getUserCol.snapshotChanges().subscribe(actionArray => {
      this.listUser = actionArray.map(item => {
        return {
          $key: item.payload.doc.id,
          ...item.payload.doc.data()
        }as User;
      });
      if (this.listUser) {
        let data: any;
        for (data of this.listUser) {
          if (data.birthday) {
            if (data.birthday.seconds) {
              data.birthday = data.birthday.toDate();
            }
          } else {
            // data.birthday = new Date(Date.now());
          }
        }
      }
      console.log(this.listUser);
      this.listdata = new MatTableDataSource(this.listUser);
      this.listdata.sortingDataAccessor = (item, property) => {
        switch (property) {
          case('roleAdmin') : return item.role.admin;
          case('roleSubscriber') : return item.role.subscriber;
          default: return item[property];
        }
      };
      this.listdata.sort = this.sort;
      this.listdata.paginator = this.paginator;
      // tslint:disable-next-line:no-shadowed-variable
      // TODO: unlock displayName when merge code
      this.listdata.filterPredicate = (data, filter) => {
        if ( data.firstName == null || data.firstName === '') {
          data.firstName = '';
        }
        if ( data.lastName == null || data.lastName === '') {
          data.lastName = '';
        }
        // if ( data.displayName == null || data.displayName === '') {
        //   data.displayName = '';
        // }
        if ( data.phone == null || data.phone === '') {
          data.phone = '';
        }
        return data.email.toLowerCase().indexOf(filter) !== -1
        || data.firstName.toString().toLowerCase().indexOf(filter) !== -1
        || data.lastName.toString().toLowerCase().indexOf(filter) !== -1
        // || data.displayName.toString().toLowerCase().indexOf(filter) !== -1
        || data.phone.toString().indexOf(filter) !== -1
        || data.role.admin.toString().indexOf(filter) !== -1
        || data.role.subscriber.toString().indexOf(filter) !== -1;
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

  private openDialog() {
    this.userService.initializeFormGroup();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    this.dialog.open(UserDetailsComponent, dialogConfig);
  }

  private onClickEdit(element) {
    this.userService.popupForm(element);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    this.dialog.open(UserDetailsComponent, dialogConfig);
  }

  private onDelete(element) {
    if (confirm('Are you want to delete?')) {
      this.userService.deleteUser(element.$key);
      this.storage.storage.refFromURL(element.photoURL).delete();
    }
  }
}
