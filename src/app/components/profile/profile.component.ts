import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component';
import { FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { trigger, state, transition, style, animate } from '@angular/animations';
import * as firebase from 'firebase';


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class ProfileComponent implements OnInit {

  collectionData: AngularFirestoreCollection<any>;
  documentData: AngularFirestoreDocument<any>;
  public loadingSpinner: boolean;
  private userData: User;
  private faPlaylist: FavoriteList[];
  private imageData: any;
  private faPlaylistData: DialogData;
  private isBlock: boolean;
  private currentUserRef: any;
  private lengthDate: LengthOfDate;
  private loadImage: any;
  private dateFormControl: FormControl = new FormControl('', [
    Validators.required,
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
  // upload song
  private tableListSongData: MatTableDataSource<any>;
  private tableListSongDataUncheck: MatTableDataSource<any>;
  private listSongData: any[];
  private listSongDataUncheck: any[];
  @ViewChild('paginatorUncheck') paginatorUncheck: MatPaginator;
  @ViewChild('paginatorCheck') paginatorCheck: MatPaginator;
  displayedColumns: string[] = ['name', 'imageSong', 'author', 'performerId', 'status'];


  constructor(
    private db: AngularFirestore,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router) {
    this.loadingSpinner = true;
    this.isBlock = true;
    // tslint:disable-next-line:max-line-length
    this.imageData = 'https://firebasestorage.googleapis.com/v0/b/touchmusic-2707e.appspot.com/o/images%2Flogo%2Fadd-square-button.png?alt=media&token=23e555d6-6ec7-499b-8d51-1f7104204a8c';
    // this.faPlaylist = new Array<FavoriteList>();
    this.lengthDate = {
      min: new Date(1790, 0, 1),
      max: new Date(),
    };
    this.listSongData = [];
  }

  ngOnInit() {
    this.loadingSpinner = true;
    // get params and user
    const getParams = this.route.snapshot.paramMap.get('uid');
    this.getCurrentUser(getParams);
    this.currentUserRef = this.db.collection('users').doc(getParams).ref;
    this.documentData = this.db.collection('users').doc(getParams);
    this.documentData.valueChanges().subscribe((res) => {
      if (res) {
        this.userData = res;
        this.fnameFormControl.setValue(this.userData.firstName);
        this.lnameFormControl.setValue(this.userData.lastName);
        this.emailFormControl.setValue(this.userData.email);
        this.phoneFormControl.setValue(this.userData.phone);
        this.dateFormControl = new FormControl(res.birthday.toDate());
        if (this.isBlock) {
          this.disableFormControl();
        } else {
          this.enableFormControl();
        }
        if (this.listSongData) {
          this.loadingSpinner = false;
        }
      }
    }, (error) => {
      console.log('error');
      if (this.listSongData.length !== 0) {
        this.loadingSpinner = false;
      }
    });

    this.collectionData = this.db.collection('FavoritePlaylist',
      query => query.where('userId', '==', this.currentUserRef));
    this.collectionData.valueChanges().subscribe((res) => {
      if (res) {
        this.faPlaylist = res;
      }
    });

    this.collectionData = this.db.collection('Performer');
    this.collectionData.valueChanges().subscribe(async (performer: Performer[]) => {
      if (performer) {
        this.listSongData = [];
        // get Song Data created by user
        this.collectionData = this.db.collection('Song', query => query.where('userId', '==', this.currentUserRef));
        await this.collectionData.valueChanges().subscribe((song) => {
          if (song) {
            song.forEach((s) => {
              let listauthor = [];
              let listperformer = [];
              if (s.author.length > 0) {
                s.author.forEach(element => {
                  listauthor = listauthor.concat(performer.filter(p => p.id === element.id));
                });
              }
              if (s.performerId.length > 0) {
                s.performerId.forEach(element => {
                  listperformer = listperformer.concat(performer.filter(p => p.id === element.id));
                });
              }
              this.listSongData.push({
                id: s.id,
                name: s.name,
                imageSong: s.imageSong,
                performerId: listperformer,
                author: listauthor,
                albumId: s.albumId.id,
                country: s.country,
                songType: s.songType,
                mp3Url: s.mp3Url,
                video: s.video,
                imageVideo: s.imageVideo,
                lyric: s.lyric
              });
            });
            this.tableListSongData = new MatTableDataSource(this.listSongData);
            this.tableListSongData.paginator = this.paginatorCheck;
          }
          if (this.userData) {
            this.loadingSpinner = false;
          }
        }, (error) => {
          console.log('Get song data error ' + error);
          if (this.userData) {
            this.loadingSpinner = false;
          }
        });

        // get song Data create by user but have not checked by admin yet
        this.collectionData = this.db.collection('userUploadSong', query => query.where('userId', '==', this.currentUserRef));
        await this.collectionData.valueChanges().subscribe((song) => {
          this.listSongDataUncheck = [];
          if (song) {
            song.forEach((s) => {
              let listauthor = [];
              let listperformer = [];
              if (s.author.length > 0) {
                s.author.forEach(element => {
                  listauthor = listauthor.concat(performer.filter(p => p.id === element.id));
                  if (!element.id) {
                    listauthor.push({name: element});
                  }
                });
              }
              if (s.performerId.length > 0) {
                s.performerId.forEach(element => {
                  listperformer = listperformer.concat(performer.filter(p => p.id === element.id));
                  if (!element.id) {
                    listperformer.push({name: element});
                  }
                });
              }
              this.listSongDataUncheck.push({
                id: s.id,
                name: s.name,
                imageSong: s.imageSong,
                performerId: listperformer,
                author: listauthor,
                albumId: s.albumId.id,
                country: s.country,
                songType: s.songType,
                mp3Url: s.mp3Url,
                video: s.video,
                imageVideo: s.imageVideo,
                lyric: s.lyric,
                status: s.status
              });
            });
            this.tableListSongDataUncheck = new MatTableDataSource(this.listSongDataUncheck);
            this.tableListSongDataUncheck.paginator = this.paginatorUncheck;
          }
        });
      }
    });
  }

  private getCurrentUser(currentLogin: any) {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        if (user.uid !== currentLogin) {
          this.router.navigate(['/welcome']);
        }
      } else {
        this.router.navigate(['/welcome']);
      }
    });
  }

  private createNewFaPlaylist() {
    // chỉ cần name và image
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '30vw',
      data: { currentUser: this.currentUserRef, selector: 'B' }
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
    console.log(this.userData);
    this.isBlock = true;
    this.disableFormControl();
    this.emailFormControl.reset(this.userData.email);
    this.dateFormControl.reset(this.userData.birthday.toDateString());
    this.fnameFormControl.reset(this.userData.firstName);
    this.lnameFormControl.reset(this.userData.lastName);
    this.phoneFormControl.reset(this.userData.phone);
  }

  private onFileSelected(event: any) {
    if (event.target.files.length !== 0) {
      const dialogRef = this.dialog.open(DialogComponent, {
        height: '78vh',
        width: '50vw',
        data: { currentUser: this.currentUserRef, data: event, selector: 'A' }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
        console.log('The dialog was closed');
      });
    }
  }

  public onClickCreate() {
    const dialogRef = this.dialog.open(DialogComponent, {
      height: '78vh',
      width: '50vw',
      data: { currentUser: this.currentUserRef, selector: 'UPLOAD_SONG' }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      console.log('The dialog was closed');
    });
  }

  public onClickEdit(song: Song) {
    const dialogRef = this.dialog.open(DialogComponent, {
      height: '78vh',
      width: '50vw',
      data: { currentUser: this.currentUserRef, data: song , selector: 'UPLOAD_SONG' }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      console.log('The dialog was closed');
    });
  }

  public onDelete(data: Song) {

  }
}

export interface DialogData {
  currentUser: any;
  data: any;
  selector: string;
}

export interface LengthOfDate {
  min: Date;
  max: Date;
}
