import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { MatTableDataSource } from '@angular/material';
import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA, MatSort, MatPaginator } from '@angular/material';
import { UserDetailsComponent } from '../user-details/user-details.component';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  getUserCol: AngularFirestoreCollection<any>;
  private listUser: User[];
  private listdata: MatTableDataSource<any>;
  // tslint:disable-next-line:max-line-length
  displayedColumns: string[] = ['email', 'firstName', 'lastName', 'displayName', 'photoURL', 'phone', 'birthday', 'roleAdmin', 'roleSubscriber', 'option'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  private searchValue: string;

  constructor(
    private afs: AngularFirestore,
    private dialog: MatDialog,
    private userService: UserService) { }

  ngOnInit() {
    this.getUserCol = this.afs.collection('users');
    this.getUserCol.snapshotChanges().subscribe(actionArray => {
      this.listUser = actionArray.map(item => {
        return {
          $key: item.payload.doc.id,
          ...item.payload.doc.data()
        }as User;
      });
      // if (this.listUser) {
      //   for (const data of this.listUser) {
      //     if (data.birthday === null) {
      //       // data.birthday = new Date(Date.now());
      //     } else {
      //       // data.birthday = data.birthday.toDate();
      //     }
      //   }
      // }
      // console.log(this.listUser);
      this.listdata = new MatTableDataSource(this.listUser);
      this.listdata.sort = this.sort;
      this.listdata.paginator = this.paginator;
      // tslint:disable-next-line:no-shadowed-variable
      this.listdata.filterPredicate = (data, filter) => {
        return data.email.toLowerCase().indexOf(filter) !== -1
        || data.firstName.toLowerCase().indexOf(filter) !== -1
        || data.lastName.toLowerCase().indexOf(filter) !== -1
        || data.displayName.toLowerCase().indexOf(filter) !== -1
        || data.phone.toLowerCase().indexOf(filter) !== -1;
        // || data.role.admin.toLowerCase().indexOf(filter) !== -1
        // || data.role.subscriber.toLowerCase().indexOf(filter) !== -1;
      };
    });
  }

  private applyFilter() {
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
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    this.dialog.open(UserDetailsComponent, dialogConfig);
  }
}
