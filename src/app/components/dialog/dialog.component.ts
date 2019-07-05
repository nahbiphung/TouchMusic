import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatDialogRef,
  MAT_DIALOG_DATA,
  ErrorStateMatcher,
  MatChipInputEvent,
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatTableDataSource,
  MatSort,
  MatPaginator} from '@angular/material';
import { DialogData } from '../profile/profile.component';
import * as firebase from 'firebase';
import {AngularFireStorage, AngularFireUploadTask} from '@angular/fire/storage';
import {MatSnackBar} from '@angular/material/snack-bar';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { SongComponent } from '../song/song.component';
import { Observable } from 'rxjs';
import { finalize, tap, startWith, map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

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
  public isEditFaPlaylist: boolean;
  public isEditSongUpload: boolean;
  public isVideo: boolean;
  private faPlaylist: FavoriteList[];
  private panelOpenState: boolean;
  public loadingSpinner: boolean;
  public isUploadSong: boolean;

  // edit favorite playlist
  private favoritePlaylistNameFCtrl: FormControl = new FormControl('', [
    Validators.maxLength(30),
    Validators.required,
  ]);
  private showImage: any;
  // upload song
  private matcher = new MyErrorStateMatcher();
  private listPerformerData: Performer[];
  private listPerformerDataFiltered: Observable<Performer[]>;
  private listAuthorData: Performer[];
  private listAuthorDataFiltered: Observable<Performer[]>;
  private listCountryData: Country[];
  private listSongTypeData: SongType[];
  private tempListPerformerData: Performer[];
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
    public toastr: ToastrService,
    private _snackBar: MatSnackBar,
    private storage: AngularFireStorage) {
    this.haveImage = false;
    this.uploadProgress = 0;
    this.isAvatar = false;
    this.isCreateNewFaList = false;
    this.isVideo = false;
    this.isAddToFaList = false;
    this.panelOpenState = true;
    this.loadingSpinner = true;
    this.isUploadSong = false;
    this.isEditFaPlaylist = false;
    this.isEditSongUpload = false;
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
        if (this.data.data) {
          this.isEditSongUpload = true;
          this.songNameFormControl.setValue(this.data.data.name);
          this.data.data.performerId.forEach(element => {
            this.performers.push(element);
          });
          this.data.data.author.forEach(element => {
            this.authors.push(element);
          });
          this.countrySelected = this.data.data.country;
          this.songTypeSelected = this.data.data.songType;
          this.lyricFormControl.setValue(this.data.data.lyric);
          this.previewImageSong = this.data.data.imageSong;
          this.previewImageVideo = this.data.data.imageVideo;
        } else {
          this.isUploadSong = true;
        }
        this.collectionData = this.db.collection('Performer');
        this.collectionData.valueChanges().subscribe((res) => {
          if (res) {
            this.listPerformerData = res;
            this.listAuthorData = res;
            this.tempListPerformerData = res;
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
      case 'EDIT_FAPLAYLIST':
        this.isEditFaPlaylist = true;
        this.imagePreview = this.data.data.image;
        this.showImage = this.data.data.image;
        this.loadingSpinner = false;
        break;
      default:
        this.loadingSpinner = false;
        break;
    }
  }

  private onFileSelected(event: any, flag?: string) {
    if (event.target.files.length !== 0) {
      switch (flag) {
        case 'songFile':
          if (this.calulateImageSize(event.target.files[0], 'mp3')) {
            this.songFile = event.target.files[0];
          } else {
            this.toastr.error('Song file size is too large', 'Error');
          }
          break;
        case 'songImage':
          // do something
          if (this.calulateImageSize(event.target.files[0], 'image')) {
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
          } else {
            this.toastr.error('image size is too large', 'Error');
          }
          break;
        case 'videoFile':
          if (this.calulateImageSize(event.target.files[0], 'mp4')) {
            this.videoFile = event.target.files[0];
          } else {
            this.toastr.error('Song file size is too large', 'Error');
          }
          break;
        case 'videoImage':
          if (this.calulateImageSize(event.target.files[0], 'image')) {
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
          } else {
            this.toastr.error('Image size is too large', 'Error');
          }
          break;
        case 'editFaImage':
          if (this.calulateImageSize(event.target.files[0], 'image')) {
            // do something
            if (event.target.files[0]) {
              this.showImage = event.target.files[0];
              // const copyThis = this;
              const previewImage = new FileReader();
              previewImage.onload = (e: any) => {
                this.imagePreview = e.currentTarget.result;
              };
              previewImage.readAsDataURL(event.target.files[0]);
            }
          } else {
            this.toastr.error('Image size is too large', 'Error');
          }
          break;
        default:
          if (this.calulateImageSize(event.target.files[0], 'image')) {
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
          } else {
            this.toastr.error('Image size is too large', 'Error');
            this.onNoClick();
          }
          break;
      }
    }
  }

  private createNewPlaylist() {
    // get data of falist
    const falist: FavoriteList = new FavoriteList();
    falist.userId = this.data.currentUser;
    falist.name = this.favoritePlaylistNameFCtrl.value();
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
                copyThis.resetForm();
                copyThis.dialogRef.close(falist);
              } else {
                copyThis.resetForm();
                copyThis.dialogRef.close();
              }
            }).catch((error) => {
              console.log('error when add collection' + error);
              if (copyThis.isCreateNewFaList) {
                copyThis.resetForm();
                copyThis.dialogRef.close(falist);
              } else {
                copyThis.resetForm();
                copyThis.dialogRef.close();
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
          this.resetForm();
          this.dialogRef.close(falist);
        } else {
          this.resetForm();
          this.dialogRef.close();
        }
      }).catch((error) => {
        console.log('error when add collection' + error);
        if (this.isCreateNewFaList) {
          this.resetForm();
          this.dialogRef.close(falist);
        } else {
          this.resetForm();
          this.dialogRef.close();
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
        details: firebase.firestore.FieldValue.arrayUnion(this.data.data.id)
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

  private changeToRef(dataRef: any[]): Array<any> {
    const changeAuthorRef = [];
    dataRef.forEach(la => {
      if (!la.id) {
        changeAuthorRef.push(la.name);
      } else {
        this.tempListPerformerData.forEach((a) => {
          if (la.name === a.name) {
            changeAuthorRef.push(this.db.collection('Performer').doc(a.id).ref);
          }
        });
      }
    });
    return changeAuthorRef;
  }

  private uploadNewSong() {
    if (this.validateSong()) {
      this.loadingSpinner = true;
      const newData = {
        id: '',
        like: 0,
        view: 0,
        comment: [],
        albumId: '',
        userId: this.data.currentUser,
        name: this.songNameFormControl.value,
        author: this.changeToRef(this.authors),
        lyric: this.lyricFormControl.value !== '' ? this.lyricFormControl.value : '',
        performerId: this.changeToRef(this.performers),
        mp3Url: '',
        imageSong: '',
        video: '',
        imageVideo: '',
        country: this.countrySelected ? this.countrySelected : '',
        songType: this.songTypeSelected ? this.songTypeSelected : '',
        status: 'waiting',
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

  private createImageSong(songId: any) {
    const imageSongStorageRef = this.storage.ref('images/' + this.imageSong.name);
    this.storage.upload('images/' + this.imageSong.name, this.imageSong).then((res) => {
      imageSongStorageRef.getDownloadURL().subscribe(url =>
        this.db.collection('userUploadSong').doc(songId).update({ imageSong: url })
      );
    });
  }
  private createImageVideo(songId: any) {
    const imageVideoStorageRef = this.storage.ref('images/' + this.imageVideo.name);
    this.storage.upload('images/' + this.imageVideo.name, this.imageVideo).then((res) => {
      imageVideoStorageRef.getDownloadURL().subscribe(url =>
        this.db.collection('userUploadSong').doc(songId).update({ imageVideo: url })
      );
    });
  }
  private createFileSong(songId: any) {
    const audioFileStorageRef = this.storage.ref('music/' + this.songFile.name);
    this.storage.upload('music/' + this.songFile.name, this.songFile).then((res) => {
      audioFileStorageRef.getDownloadURL().subscribe(url =>
        this.db.collection('userUploadSong').doc(songId).update({ mp3Url: url })
      );
    });
  }
  private createFileVideo(songId: any) {
    const videoFileStorageRef = this.storage.ref('video/' + this.videoFile.name);
    this.storage.upload('video/' + this.videoFile.name, this.videoFile).then((res) => {
      videoFileStorageRef.getDownloadURL().subscribe(url =>
        this.db.collection('userUploadSong').doc(songId).update({ video: url })
      );
    });
  }

  private uploadImageandFile(songId: any) {
    if (this.imageSong) {
      this.createImageSong(songId);
    }

    if (this.imageVideo) {
      this.createImageVideo(songId);
    }

    if (this.songFile) {
      this.createFileSong(songId);
    }

    if (this.videoFile) {
      this.createFileVideo(songId);
    }
  }

  private validateSong(): boolean {
    if (this.songNameFormControl.value === '') {
      this.toastr.error('Song name is required', 'Error');
      return false;
    } else if (this.performers.length === 0) {
      this.toastr.error('Song must has Performer', 'Error');
      return false;
    } else if (this.performers.length === 0) {
      this.toastr.error('Song must has author', 'Error');
      return false;
    } else if (!this.songFile) {
      this.toastr.error('Mp3 file is required', 'Error');
      return false;
    } else if (!this.imageSong) {
      this.toastr.error('Mp3 image is required', 'Error');
      return false;
    } else if (!this.countrySelected) {
      this.toastr.error('Song must have country', 'Error');
      return false;
    } else if (!this.songTypeSelected) {
      this.toastr.error('Song must have country', 'Error');
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

  private onRemoveSong(song: any) {
    this.data.data.details = this.data.data.details.filter(s => s.id !== song.id);
  }

  private cancelEdit() {
    this.imagePreview = '';
    this.onNoClick();
  }

  private onEditFaPlaylist() {
    const detachSongId = [];
    this.data.data.details.forEach((element) => {
      detachSongId.push(element.id);
    });
    if (this.data.data.image !== this.imagePreview) {
      const detachNameImage = this.data.data.image.match(/images%2F(.*?)?.alt/i)[1];
      const imageRef = this.storage.ref('images/' + detachNameImage);
      this.storage.upload('images/' + detachNameImage, this.showImage).then(async (res) => {
        const downloadUrl =  await imageRef.getDownloadURL().toPromise();
        this.db.collection('FavoritePlaylist').doc(this.data.data.id).update({image: downloadUrl});
      });
    }
    this.db.collection('FavoritePlaylist').doc(this.data.data.id).update({
      name: this.data.data.name,
      details: detachSongId,
    }).then((res) => {
      console.log('sửa thành công');
      this.dialogRef.close();
    });
  }

  private editUploadSong() {
    if (this.data.data.id) {
      this.loadingSpinner = true;
      const updateData = {
        albumId: '',
        userId: this.data.currentUser,
        name: this.songNameFormControl.value,
        author: this.changeToRef(this.authors),
        lyric: this.lyricFormControl.value !== '' ? this.lyricFormControl.value : '',
        performerId: this.changeToRef(this.performers),
        country: this.countrySelected ? this.countrySelected : '',
        songType: this.songTypeSelected ? this.songTypeSelected : ''
      }
      this.db.collection('userUploadSong').doc(this.data.data.id).update(updateData).then(() => {
        this.loadingSpinner = false;
        this.dialogRef.close();
      });
      this.updateImageandFile(this.data.data.id);
    }
  }


  private updateImageSong(songId: any) {
    const detachImageName = this.data.data.imageSong.match(/images%2F(.*?)?.alt/i);
    const imageSongStorageRef = this.storage.ref('images/' + detachImageName[1]);
    this.storage.upload('images/' + detachImageName[1], this.imageSong).then((res) => {
      imageSongStorageRef.getDownloadURL().subscribe(url =>
        this.db.collection('userUploadSong').doc(songId).update({ imageSong: url })
      );
    });
  }
  private updateImageVideo(songId: any) {
    const detachImageName = this.data.data.imageVideo.match(/images%2F(.*?)?.alt/i);
    const imageVideoStorageRef = this.storage.ref('images/' + detachImageName[1]);
    this.storage.upload('images/' + detachImageName[1], this.imageVideo).then((res) => {
      imageVideoStorageRef.getDownloadURL().subscribe(url =>
        this.db.collection('userUploadSong').doc(songId).update({ imageVideo: url })
      );
    });
  }
  private updateFileSong(songId: any) {
    const detachMusicName = this.songFile.match(/music%2F(.*?)?.alt/i);
    const musicFileStorageRef = this.storage.ref('music/' + detachMusicName[1]);
    this.storage.upload('music/' + detachMusicName[1], this.songFile).then((res) => {
      musicFileStorageRef.getDownloadURL().subscribe(url =>
        this.db.collection('userUploadSong').doc(songId).update({ mp3Url: url })
      );
    });
  }
  private updateFileVideo(songId: any) {
    const detachVideoName = this.videoFile.match(/video%2F(.*?)?.alt/i);
    const videoFileStorageRef = this.storage.ref('video/' + detachVideoName[1]);
    this.storage.upload('video/' + detachVideoName[1], this.videoFile).then((res) => {
      videoFileStorageRef.getDownloadURL().subscribe(url =>
        this.db.collection('userUploadSong').doc(songId).update({ video: url })
      );
    });
  }

  private updateImageandFile(songId: any) {
    // check file change
    if (this.data.data.imageSong !== this.previewImageSong) {
      if (!this.data.data.imageSong) {
        this.createImageSong(songId);
      } else {
        this.updateImageSong(songId);
      }
    }
    if (this.data.data.imageVideo !== this.previewImageVideo) {
      if (!this.data.data.imageVideo) {
        this.createImageVideo(songId);
      } else {
        this.updateImageVideo(songId);
      }
    }
    if (this.songFile) {
      if (this.data.data.mp3Url) {
        this.updateFileSong(songId);
      } else {
        this.createFileSong(songId);
      }
    }
    if (this.videoFile) {
      if (this.data.data.video) {
        this.updateFileVideo(songId);
      } else {
        this.createFileVideo(songId);
      }
    }
  }

  private calulateImageSize(file: any, flag: string): boolean {
    const convertToMB = ((file.size / 1024) / 1024);
    switch (flag) {
      case 'image':
        if (convertToMB > 5) {
          return false;
        }
        break;
      case 'mp3':
        if (convertToMB > 50) {
          return false;
        }
        break;
      case 'mp4':
        if (convertToMB > 100) {
          return false;
        }
        break;
      default:
        break;
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
