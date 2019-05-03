import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { MatTableDataSource } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserDetailsComponent } from '../user-details/user-details.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  getUserCol: AngularFirestoreCollection<any>;
  private listUser: MatTableDataSource<any>;
  displayedColumns: string[] = ['email', 'firstName', 'lastName', 'photoURL', 'phone', 'birthday', 'role', 'option'];

  constructor(private afs: AngularFirestore,
              private dialog: MatDialog) { }

  ngOnInit() {
    this.getUserCol = this.afs.collection('users');
    this.getUserCol.valueChanges().subscribe((res) => {
      if (res) {
        for (const data of res) {
          if (data.birthday === null) {
            data.birthday = Date.now();
          } else {
          }
        }
        this.listUser = new MatTableDataSource(res);
        // console.log(this.listUser);
      }
    });
  }

  private applyFilter(value: string) {
    this.listUser.filter = value.trim().toLowerCase();
  }

  private openDialog() {
    const dialogRef = this.dialog.open(UserDetailsComponent);
  }
}
