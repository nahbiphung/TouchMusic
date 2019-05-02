import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  collectionData: AngularFirestoreCollection<any>;
  documentData: AngularFirestoreDocument<any>;
  private loadingSpinner: boolean;
  private userData: User;
  private faPlaylist: FavoriteList[];
  private imageData: any;
  private faPlaylistData: DialogData;


  constructor(private db: AngularFirestore, private route: ActivatedRoute, public dialog: MatDialog) {
    this.loadingSpinner = true;
    // tslint:disable-next-line:max-line-length
    this.imageData = 'https://firebasestorage.googleapis.com/v0/b/touchmusic-2707e.appspot.com/o/images%2Flogo%2Fadd-square-button.png?alt=media&token=23e555d6-6ec7-499b-8d51-1f7104204a8c';
    // this.faPlaylist = new Array<FavoriteList>();
   }

  ngOnInit() {
    // get params and user
    const getParams = this.route.snapshot.paramMap.get('uid');
    this.documentData = this.db.collection('users').doc(getParams);
    this.documentData.valueChanges().subscribe((res) => {
      if (res) {
        this.userData = res;
        console.log(this.userData);
        this.loadingSpinner = false;
      }
    }, (error) => {
      console.log('error');
    });

    this.collectionData = this.db.collection('FavoritePlaylist',
      query => query.where('userId', '==', this.db.collection('users').doc(getParams).ref));
    this.collectionData.valueChanges().subscribe((res) => {
        if (res) {
          this.faPlaylist = res;
          console.log(res);
        }
      });
  }

  private createNewFaPlaylist() {
    // chỉ cần name và image
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}

export interface DialogData {
  name: string;
  image: string;
}
