import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component';
import {FormControl, Validators, FormGroupDirective, NgForm} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
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
  private isBlock: boolean;
  private currentUserRef: any;
  private lengthDate: LengthOfDate;
  private dateFormControl: FormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('^(0[1-9]|[12][0-9]|3[01])/-(0[1-9]|1[012])/-\d{4}$')
  ]);
  private emailFormControl: FormControl = new FormControl('', [
    Validators.required,
    Validators.email
  ]);
  private fnameFormControl: FormControl = new FormControl('', [
    Validators.maxLength(30),
    Validators.required,
  ]);
  private lnameFormControl: FormControl = new FormControl('', [
    Validators.maxLength(30),
    Validators.required,
  ]);
  private phoneFormControl: FormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('^[0-9]*$'),
  ]);

  private matcher = new MyErrorStateMatcher();


  constructor(private db: AngularFirestore, private route: ActivatedRoute, public dialog: MatDialog) {
    this.loadingSpinner = true;
    this.isBlock = true;
    // tslint:disable-next-line:max-line-length
    this.imageData = 'https://firebasestorage.googleapis.com/v0/b/touchmusic-2707e.appspot.com/o/images%2Flogo%2Fadd-square-button.png?alt=media&token=23e555d6-6ec7-499b-8d51-1f7104204a8c';
    // this.faPlaylist = new Array<FavoriteList>();
    this.lengthDate = {
      min: new Date(1790, 0, 1),
      max: new Date(),
    };
   }

  ngOnInit() {
    // get params and user
    const getParams = this.route.snapshot.paramMap.get('uid');
    this.currentUserRef = this.db.collection('users').doc(getParams).ref;
    this.documentData = this.db.collection('users').doc(getParams);
    this.documentData.valueChanges().subscribe((res) => {
      if (res) {
        this.userData = res;
        this.dateFormControl = new FormControl(res.birthday.toDate());
        console.log(this.matcher);
        if (this.isBlock) {
          this.disableFormControl();
        } else {
          this.enableFormControl();
        }
        this.loadingSpinner = false;
      }
    }, (error) => {
      console.log('error');
    });

    this.collectionData = this.db.collection('FavoritePlaylist',
      query => query.where('userId', '==', this.currentUserRef));
    this.collectionData.valueChanges().subscribe((res) => {
        if (res) {
          this.faPlaylist = res;
        }
      });
  }

  private createNewFaPlaylist() {
    // chỉ cần name và image
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '30vw',
      data: {currentUser: this.currentUserRef}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      console.log('The dialog was closed');
    });
  }

  private updateProfile() {
    this.db.collection('users').doc(this.userData.uid).update({
      firstName: this.fnameFormControl.value,
      lastName: this.lnameFormControl.value,
      birthday: this.dateFormControl.value,
      email: this.emailFormControl.value,
      phone: this.phoneFormControl.value
    }).then(() => {
      this.disableFormControl();
      this.isBlock = true;
    });
  }

  private allowEdit() {
    this.isBlock = false;
    this.enableFormControl();
  }

  private disableFormControl() {
    this.emailFormControl.disable();
    this.dateFormControl.disable();
    this.lnameFormControl.disable();
    this.fnameFormControl.disable();
    this.phoneFormControl.disable();
  }

  private enableFormControl() {
    this.emailFormControl.enable();
    this.dateFormControl.enable();
    this.fnameFormControl.enable();
    this.lnameFormControl.enable();
    this.phoneFormControl.enable();
  }

  private cancel() {
    this.isBlock = true;
    this.disableFormControl();
    this.emailFormControl.reset();
    this.dateFormControl.reset();
    this.fnameFormControl.reset();
    this.lnameFormControl.reset();
    this.phoneFormControl.reset();
  }

  private 

}

export interface DialogData {
  currentUser: any;
}

export interface LengthOfDate {
  min: Date;
  max: Date;
}
