import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatDialogRef, MAT_DIALOG_DATA, ErrorStateMatcher, MatChipInputEvent, MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material';
import { DialogData } from '../profile/profile.component';
import * as firebase from 'firebase';
import {AngularFireStorage, AngularFireUploadTask} from '@angular/fire/storage';
import {MatSnackBar} from '@angular/material/snack-bar';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { SongComponent } from '../song/song.component';
import { Observable } from 'rxjs';
import { finalize, tap, startWith, map } from 'rxjs/operators';

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
  private listPerformerDataFiltered: Observable<Performer[]>;
  private listAuthorData: Performer[];
  private listAuthorDataFiltered: Observable<Performer[]>;
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
  private separatorKeysCodes: number[] = [ENTER, COMMA];
  @ViewChild('authorInput') authorInput: ElementRef<HTMLInputElement>;
  @ViewChild('authorauto') authormatAutocomplete: MatAutocomplete;
  @ViewChild('performerInput') performerInput: ElementRef<HTMLInputElement>;
  @ViewChild('performerauto') performermatAutocomplete: MatAutocomplete;

  private uploadProgressFileSong: number;
  private uploadProgressImageSong: number;
  private uploadProgressFileVideo: number;
  private uploadProgressImageVideo: number;

  private authors: any[];
  private performers: any[];
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
    this.listAuthorData = [];
    this.listCountryData = [];
    this.listSongTypeData = [];
    this.authors = [];
    this.performers = [];
    this.listAuthorDataFiltered = this.authorFormControl.valueChanges.pipe(
      startWith(null),
      map((per: string | null) => per ? this._filter(per, true) : this.listAuthorData.slice()));
    this.listPerformerDataFiltered = this.performerFormControl.valueChanges.pipe(
      startWith(null),
      map((per: string | null) => per ? this._filter(per, false) : this.listPerformerData.slice()));
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
            this.listAuthorData = res;
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
    if (this.validateSong()) {
      this.loadingSpinner = true;
      const newData: Song = {
        id: '',
        like: 0,
        view: 0,
        comment: [],
        albumId: '',
        userId: this.data.currentUser,
        name: this.songNameFormControl.value,
        author: this.authors,
        lyric: this.lyricFormControl.value !== '' ? this.lyricFormControl.value : '',
        performerId: this.performers,
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
          this.loadingSpinner = false;
          this.dialogRef.close();
        }
      }).catch((error) => {
        console.log('Song upload Error ' + error);
      });
    }
  }

  private uploadImageandFile(songId: any) {
    if (this.imageSong) {
      const imageSongStorageRef = this.storage.ref('images/' + this.imageSong.name);
      this.storage.upload('images/' + this.imageSong.name, this.imageSong)
        .percentageChanges().subscribe(res => this.uploadProgressImageSong = res);
      this.storage.upload('images/' + this.imageSong.name, this.imageSong).then(async (res) => {
        const downloadUrl =  await imageSongStorageRef.getDownloadURL().toPromise();
        this.db.collection('userUploadSong').doc(songId).update({imageSong: downloadUrl});
      });
    }

    if (this.imageVideo) {
      const imageVideoStorageRef = this.storage.ref('images/' + this.imageVideo.name);
      this.storage.upload('images/' + this.imageVideo.name, this.imageVideo).then(async (res) => {
        const downloadUrl =  await imageVideoStorageRef.getDownloadURL().toPromise();
        this.db.collection('userUploadSong').doc(songId).update({imageVideo: downloadUrl});
      });
    }

    if (this.songFile) {
      const audioFileStorageRef = this.storage.ref('music/' + this.songFile.name);
      this.storage.upload('music/' + this.songFile.name, this.songFile)
        .percentageChanges().subscribe(res => this.uploadProgressFileSong = res);
      this.storage.upload('music/' + this.songFile.name, this.songFile).then(async (res) => {
        const downloadUrl =  await audioFileStorageRef.getDownloadURL().toPromise();
        this.db.collection('userUploadSong').doc(songId).update({mp3Url: downloadUrl});
      });
    }

    if (this.videoFile) {
      const videoFileStorageRef = this.storage.ref('video/' + this.videoFile.name);
      this.storage.upload('video/' + this.videoFile.name, this.videoFile).then(async (res) => {
        const downloadUrl =  await videoFileStorageRef.getDownloadURL().toPromise();
        this.db.collection('userUploadSong').doc(songId).update({video: downloadUrl});
      });
    }
  }

  private validateSong(): boolean {
    if (this.songNameFormControl.value === '' || this.performerFormControl.value === '' ||
    this.authorFormControl.value === '' || !this.songFile || !this.imageSong) {
      return false;
    }
    return true;
  }

  private remove(performer: Performer, isAuthor: boolean) {
    if (isAuthor) {
      this.authors = this.authors.filter(auth => auth.name !== performer.name);
      this.listAuthorData.push(performer);
    } else {
      this.performers = this.performers.filter(per => per.name !== performer.name);
      this.listPerformerData.push(performer);
    }
  }

  private add(event: MatChipInputEvent, isAuthor: boolean) {
    if (isAuthor) {
      if (!this.authormatAutocomplete.isOpen) {
        const input = event.input;
        const value = event.value;
        if ((value || '').trim()) {
          this.authors.push({
            name: value.trim(),
          });
        }
        // Reset the input value
        if (input) {
          input.value = '';
        }
        this.authorFormControl.setValue(null);
      }
    } else {
      if (!this.performermatAutocomplete.isOpen) {
        const input = event.input;
        const value = event.value;
        if ((value || '').trim()) {
          this.performers.push({
            name: value.trim(),
          });
        }
        // Reset the input value
        if (input) {
          input.value = '';
        }
        this.performerFormControl.setValue(null);
      }
    }
  }

  private selected(event: MatAutocompleteSelectedEvent, isAuthor: boolean) {
    if (isAuthor) {
      this.authors.push(event.option.value);
      this.listAuthorData = this.listAuthorData.filter(auth => auth.id !== event.option.value.id);
      this.authorInput.nativeElement.value = '';
      this.authorFormControl.setValue(null);
    } else {
      this.performers.push(event.option.value);
      this.listPerformerData = this.listPerformerData.filter(per => per.id !== event.option.value.id);
      this.performerInput.nativeElement.value = '';
      this.performerFormControl.setValue(null);
    }
  }

  private _filter(value: any, isAuthor: boolean): Performer[] {
    const filterValue = value.name ? value.name.toLowerCase() : value.toLowerCase();
    if (isAuthor) {
      return this.listAuthorData.filter(per => per.name.toLowerCase().indexOf(filterValue) === 0);
    } else {
      return this.listPerformerData.filter(per => per.name.toLowerCase().indexOf(filterValue) === 0);
    }
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
