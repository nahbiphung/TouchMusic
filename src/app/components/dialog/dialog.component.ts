import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, ErrorStateMatcher } from '@angular/material';
import { DialogData } from '../profile/profile.component';
import * as firebase from 'firebase';
import {AngularFireStorage, AngularFireUploadTask} from '@angular/fire/storage';
import {MatSnackBar} from '@angular/material/snack-bar';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { SongComponent } from '../song/song.component';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  private collectionData: AngularFirestoreCollection<any>;
  private documentData: AngularFirestoreDocument<any>;
  private uploadProgress: number;
  private loadImage: any;
  private haveImage: boolean;
  private name: string;
  private imagePreview: string;
  private isAvatar: boolean;
  private isCreateNewFaList: boolean;
  private isAddToFaList: boolean;
  public isVideo: boolean;
  private faPlaylist: FavoriteList[];
  private panelOpenState: boolean;
  public loadingSpinner: boolean;
  private isUploadSong: boolean;

  // upload song
  private matcher = new MyErrorStateMatcher();
  private listPerformerData: Performer[];
  private listCountryData: Country[];
  private listSongTypeData: SongType[];
  private imageSong: any;
  private previewImageSong: any;
  private imageVideo: any;
  private previewImageVideo: any;
  private songFile: any;
  private videoFile: any;
  private countrySelected: string;
  private songTypeSelected: string;
  private uploadTask: AngularFireUploadTask;
  private snapshot: Observable<any>;
  private songNameFormControl: FormControl = new FormControl('', [
    Validators.maxLength(30),
    Validators.required,
  ]);
  private authorFormControl: FormControl = new FormControl('', [
    Validators.maxLength(30),
    Validators.required,
  ]);
  private performerFormControl: FormControl = new FormControl('', [
    Validators.maxLength(30),
    Validators.required,
  ]);
  private lyricFormControl: FormControl = new FormControl('', [
    Validators.maxLength(500),
  ]);

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private db: AngularFirestore,
    private _snackBar: MatSnackBar,
    private storage: AngularFireStorage) {
    this.haveImage = false;
    this.uploadProgress = 0;
    this.name = '';
    this.isAvatar = false;
    this.isCreateNewFaList = false;
    this.isVideo = false;
    this.isAddToFaList = false;
    this.panelOpenState = true;
    this.loadingSpinner = true;
    this.isUploadSong = false;
    // upload song
    this.listPerformerData = [];
    this.listCountryData = [];
    this.listSongTypeData = [];
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    switch (this.data.selector) {
      case 'A':
        this.isAvatar = true;
        this.onFileSelected(this.data.data);
        this.loadingSpinner = false;
        break;
      case 'B':
        this.isCreateNewFaList = true;
        this.loadingSpinner = false;
        break;
      case 'C':
        this.isAddToFaList = true;
        this.collectionData = this.db.collection('FavoritePlaylist',
          query => query.where('userId', '==', this.data.currentUser));
        this.collectionData.valueChanges().subscribe((res) => {
          if (res) {
            this.faPlaylist = res;
            this.loadingSpinner = false;
          }
        });
        break;
      case 'D':
        this.isVideo = true;
        this.loadingSpinner = false;
        break;
      case 'UPLOAD_SONG':
        this.isUploadSong = true;
        this.collectionData = this.db.collection('Performer');
        this.collectionData.valueChanges().subscribe((res) => {
          if (res) {
            this.listPerformerData = res;
            this.loadingSpinner = false;
          }
        });
        this.collectionData = this.db.collection('Country');
        this.collectionData.valueChanges().subscribe((res) => {
          if (res) {
            this.listCountryData = res;
            this.loadingSpinner = false;
          }
        });
        this.collectionData = this.db.collection('SongType');
        this.collectionData.valueChanges().subscribe((res) => {
          if (res) {
            this.listSongTypeData = res;
            this.loadingSpinner = false;
          }
        });
        break;
      default:
        this.loadingSpinner = false;
        break;
    }
  }

  private onFileSelected(event: any, flag?: string) {
    switch (flag) {
      case 'songFile':
        this.songFile = event.target.files[0];
        // do something
        break;
      case 'songImage':
        // do something
        this.imageSong = event.target.files[0];
        if (this.imageSong) {
          this.haveImage = true;
          const copyThis = this;
          const previewImage = new FileReader();
          previewImage.onload = (e: any) => {
            copyThis.previewImageSong = e.currentTarget.result;
          };
          previewImage.readAsDataURL(this.imageSong);
        }
        break;
      case 'videoFile':
        // do something
        this.videoFile = event.target.files[0];
        break;
      case 'videoImage':
        // do something
        this.imageVideo = event.target.files[0];
        if (this.imageVideo) {
          this.haveImage = true;
          const copyThis = this;
          const previewImage = new FileReader();
          previewImage.onload = (e: any) => {
            copyThis.previewImageVideo = e.currentTarget.result;
          };
          previewImage.readAsDataURL(this.imageVideo);
        }
        break;
      default:
        this.loadImage = event.target.files[0];
        if (this.loadImage) {
          this.haveImage = true;
          const copyThis = this;
          const previewImage = new FileReader();
          previewImage.onload = (e: any) => {
            copyThis.imagePreview = e.currentTarget.result;
          };
          previewImage.readAsDataURL(this.loadImage);
        } else {
          this.haveImage = false;
        }
        break;
    }
  }

  private createNewPlaylist() {
    // get data of falist
    const falist: FavoriteList = new FavoriteList();
    falist.userId = this.data.currentUser;
    falist.name = this.name;
    if (this.loadImage) {
      const storageRef = firebase.storage().ref('images/' + this.loadImage.name);

      // upload file
      const task = storageRef.put(this.loadImage);
      const copyThis = this;
      // update progress bar
      task.on('state_changed',
        function then(snapshot) {
          const percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          copyThis.uploadProgress = percent;
        },
        function wrong(error) {
          console.log(error);
        },
        function complete() {
          task.snapshot.ref.getDownloadURL().then((res) => {
            falist.image = res;
            copyThis.db.collection('FavoritePlaylist').add({
              name: falist.name,
              userId: falist.userId,
              details: [],
              image: res,
              id: ''
            }).then((result) => {
              falist.userId = result.id;
              copyThis.db.collection('FavoritePlaylist').doc(result.id).update({
                id: result.id,
              });
              if (copyThis.isCreateNewFaList) {
                copyThis.dialogRef.close(falist);
                this.resetForm();
              } else {
                this.resetForm();
              }
            }).catch((error) => {
              console.log('error when add collection' + error);
              if (copyThis.isCreateNewFaList) {
                copyThis.dialogRef.close(falist);
                this.resetForm();
              } else {
                this.resetForm();
              }
            });
          });
        }
      );
    } else {
      this.db.collection('FavoritePlaylist').add({
        name: falist.name,
        userId: falist.userId,
        details: [],
        image: '',
        id: ''
      }).then((result) => {
        falist.userId = result.id;
        this.db.collection('FavoritePlaylist').doc(result.id).update({
          id: result.id,
        });
        if (this.isCreateNewFaList) {
          this.dialogRef.close(falist);
          this.resetForm();
        } else {
          this.resetForm();
        }
      }).catch((error) => {
        console.log('error when add collection' + error);
        if (this.isCreateNewFaList) {
          this.dialogRef.close(falist);
          this.resetForm();
        } else {
          this.resetForm();
        }
      });

    }
  }

  private resetForm() {
    this.loadImage = {};
    this.imagePreview = '';
    this.name = '';
  }

  private uploadNewAvatar() {
    const storageRef = firebase.storage().ref('images/' + this.loadImage.name);
    // upload file
    const task = storageRef.put(this.loadImage);
    const copyThis = this;
    // update progress bar
    task.on('state_changed',
      function then(snapshot) {
        const percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        copyThis.uploadProgress = percent;
        console.log(copyThis.uploadProgress);
      },
      function wrong(error) {
        console.log(error);
      },
      function complete() {
        task.snapshot.ref.getDownloadURL().then((res) => {
          if (res) {
            firebase.auth().currentUser.updateProfile({
              photoURL: res,
            }).catch((error) => {
              console.log(error);
            });
            copyThis.db.collection('users').doc(copyThis.data.currentUser.id).update({
              photoURL: res
            }).then(() => {
              copyThis.dialogRef.close(copyThis.loadImage);
            });
          }
        });
      }
    );
  }

  private addSongtofaList(data: FavoriteList) {
    this.loadingSpinner = true;
    let duplicateSong = false;
    data.details.forEach(e => {
      if (e.id === this.data.data.id) {
        duplicateSong = true;
      }
    });
    if (!duplicateSong) {
      // nghĩa là ko bị trùng bài hát
      this.documentData = this.db.collection('FavoritePlaylist').doc(data.id);
      this.documentData.update({
        details: firebase.firestore.FieldValue.arrayUnion({
          author: this.data.data.author,
          id: this.data.data.id,
          mp3Url: this.data.data.mp3Url,
          name: this.data.data.name,
        })
      }).then(() => {
        this.loadingSpinner = false;
        this.dialogRef.close();
      });
    } else {
      this.openMessage('Bài hát đã trong playlist', 'Đóng');
      this.loadingSpinner = false;
    }
  }
  private openMessage(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      verticalPosition: 'top',
    });
  }

  private uploadNewSong() {
    // cần data của những field sau
    // this.authorFormControl -- author
    // this.songNameFormControl -- name
    // this.lyricFormControl -- lyric
    // this.performerFormControl -- performerId
    // this.songFile -- mp3Url
    // this.imageSong -- imageSong
    // this.videoFile -- video
    // this.imageVideo -- imageVideo
    // this.countrySelected -- country
    // this.songTypeSelected -- songType
    if (this.validateSong()) {
      const newData: Song = {
        id: '',
        like: 0,
        view: 0,
        comment: [],
        albumId: '',
        userId: this.data.currentUser,
        name: this.songNameFormControl.value,
        author: [this.authorFormControl.value],
        lyric: this.lyricFormControl.value !== '' ? this.lyricFormControl.value : '',
        performerId: [this.performerFormControl.value],
        mp3Url: '',
        imageSong: '',
        video: '',
        imageVideo: '',
        country: this.countrySelected ? this.countrySelected : '',
        songType: this.songTypeSelected ? this.songTypeSelected : ''
      };
      this.db.collection('userUploadSong').add(newData).then((res) => {
        if (res) {
          this.db.collection('userUploadSong').doc(res.id).update({id: res.id});
          this.uploadImageandFile(res.id);
        }
      }).catch((error) => {
        console.log('Song upload Error ' + error);
      })
    }
  }

  private uploadImageandFile(songId: any) {
    const imageSongStorageRef = this.storage.ref('images/' + this.imageSong.name);
    // const imageVideoStorageRef = this.storage.ref('images/' + this.imageVideo.name);
    // upload image file 
    this.uploadTask = this.storage.upload('images/' + this.imageSong.name, this.imageSong);
    this.snapshot = this.uploadTask.snapshotChanges().pipe(tap(),
      finalize(async () => {
        const downloadUrl =  await imageSongStorageRef.getDownloadURL().toPromise();
        this.db.collection('userUploadSong').doc(songId).update({imageSong: downloadUrl});
      }),
    );
  }

  private validateSong(): boolean {
    if(this.songNameFormControl.value === '' || this.performerFormControl.value === '' ||
    this.authorFormControl.value === '' || !this.songFile || !this.imageSong) {
      return false;
    }
    return true;
  }
}

export class FavoriteList {
  id: string;
  image: string;
  name: string;
  userId: string;
  details: [{
    author: string;
    id: string;
    mp3Url: string;
    name: string;
  }];
}
