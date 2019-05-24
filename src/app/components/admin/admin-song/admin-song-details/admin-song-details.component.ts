import { Component, OnInit } from '@angular/core';
import { AdminSongService } from '../../../../services/admin-song.service';
import { FormArray } from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize, filter, takeLast } from 'rxjs/operators';

@Component({
  selector: 'app-admin-song-details',
  templateUrl: './admin-song-details.component.html',
  styleUrls: ['./admin-song-details.component.scss']
})
export class AdminSongDetailsComponent implements OnInit {

  getPerformer: AngularFirestoreCollection<any>;
  getUser: AngularFirestoreCollection<any>;
  getAlbum: AngularFirestoreCollection<any>;
  getCountry: AngularFirestoreCollection<any>;
  getSongType: AngularFirestoreCollection<any>;
  listPerformer: Performer[];
  listUser: User[];
  listAlbum: Album[];
  listCountry: Country[];
  listSongType: SongType[];

  private thisFile = null;
  private thisFileMp3 = null;
  private thisFileVideo = null;
  private fileName = '';
  private fileMp3Name = '';
  private fileVideoName = '';
  downLoadURL: any;
  downLoadMp3URL: any;
  downLoadVideoURL: any;
  imageUrl: any;
  mp3Url: any;
  videoUrl: any;
  uploadPercent: Observable<number>;
  uploadMp3Percent: Observable<number>;
  uploadVideoPercent: Observable<number>;

  constructor(
    private songService: AdminSongService,
    private afs: AngularFirestore,
    private storage: AngularFireStorage,
  ) { }

  ngOnInit() {
    this.songService.getSong();

    this.getUser = this.afs.collection('users');
    this.getUser.snapshotChanges().subscribe(arr => {
      this.listUser = arr.map(item => {
        return {
          id: item.payload.doc.id,
          ...item.payload.doc.data()
        } as User;
      });
    });

    this.getPerformer = this.afs.collection('Performer');
    this.getPerformer.snapshotChanges().subscribe(arr => {
      this.listPerformer = arr.map(item => {
        return {
          id: item.payload.doc.id,
          ...item.payload.doc.data()
        } as Performer;
      });
    });

    this.getAlbum = this.afs.collection('Album');
    this.getAlbum.snapshotChanges().subscribe(arr => {
      this.listAlbum = arr.map(item => {
        return {
          id: item.payload.doc.id,
          ...item.payload.doc.data()
        } as Album;
      });
    });

    this.getCountry = this.afs.collection('Country');
    this.getCountry.snapshotChanges().subscribe(arr => {
      this.listCountry = arr.map(item => {
        return {
          id: item.payload.doc.id,
          ...item.payload.doc.data()
        } as Country;
      });
    });

    this.getSongType = this.afs.collection('SongType');
    this.getSongType.snapshotChanges().subscribe(arr => {
      this.listSongType = arr.map(item => {
        return {
          id: item.payload.doc.id,
          ...item.payload.doc.data()
        } as SongType;
      });
    });
  }

  onClickAddComment() {
    const control = this.songService.formSong.controls.comment as FormArray;
    control.push(this.songService.addComment());
  }

  onClickRemoveComment(index: number) {
    (this.songService.formSong.get('comment') as FormArray).removeAt(index);
  }

  onClickAddSubComment(ix: number) {
    const control = (this.songService.formSong.controls.comment as FormArray).at(ix).get('subComment') as FormArray;
    control.push(this.songService.addSubComment());
  }

  onClickRemoveSubComment(ix: number, iy: number) {
    const control = (this.songService.formSong.controls.comment as FormArray).at(ix).get('subComment') as FormArray;
    control.removeAt(iy);
  }

  onSelectFile(event: any) {
    this.thisFile = event.target.files[0];
    this.fileName = event.target.files[0].name;
    // reader to get img
    const reader = new FileReader();
    reader.readAsDataURL(this.thisFile);
    reader.onload = (e) => {
      this.songService.formSong.controls.imageSong.setValue(reader.result);
    };
  }

  onSelectMp3(event: any) {
    this.thisFileMp3 = event.target.files[0];
    this.fileMp3Name = event.target.files[0].name;
    this.songService.formSong.controls.mp3Url.setValue(this.fileMp3Name);
    // const filePath = 'music/' + this.fileName;
    // const fileRef = this.storage.ref(filePath);
    // this.storage.upload(filePath, this.thisFile);
  }

  onSelectVideo(event: any) {
    this.thisFileVideo = event.target.files[0];
    this.fileVideoName = event.target.files[0].name;
    this.songService.formSong.controls.mp3Url.setValue(this.fileVideoName);
    // const filePath = 'video/' + this.fileName;
    // const fileRef = this.storage.ref(filePath);
    // this.storage.upload(filePath, this.thisFile);
  }

  onSetValue() {
    if (this.songService.formSong.controls.albumId.value) {
      this.getAlbum.valueChanges().subscribe(resAlbum => {
        const dataAlbum: any[] = resAlbum.filter(e => e.id === this.songService.formSong.controls.albumId.value);
        this.songService.formSong.controls.album.setValue(dataAlbum[0].name);
      });
    }
    if (this.songService.formSong.controls.countryId.value) {
      this.getCountry.valueChanges().subscribe(resCountry => {
        const dataCountry: any[] = resCountry.filter(e => e.id === this.songService.formSong.controls.countryId.value);
        this.songService.formSong.controls.country.setValue(dataCountry[0].name);
      });
    }

    if (this.songService.formSong.controls.performerId.value) {
      this.getPerformer.valueChanges().subscribe(resPerformer => {
        const dataPerformer: any[] = resPerformer.filter(e => e.id === this.songService.formSong.controls.performerId.value);
        this.songService.formSong.controls.performer.setValue(dataPerformer[0].name);
      });
    }

    if (this.songService.formSong.controls.songTypeId.value) {
      this.getSongType.valueChanges().subscribe(resSongtype => {
        const dataSongType: any[] = resSongtype.filter(e => e.id === this.songService.formSong.controls.songTypeId.value);
        this.songService.formSong.controls.songType.setValue(dataSongType[0].name);
      });
    }

    if (this.songService.formSong.controls.userId.value) {
      this.getUser.valueChanges().subscribe(resUser => {
        const dataUser: any[] = resUser.filter(e => e.uid === this.songService.formSong.controls.userId.value);
        this.songService.formSong.controls.user.setValue(dataUser[0].displayName);
      });
    }
  }

  // upLoad() {
  //   return new Promise((resolve, reject) => {
  //     if (this.fileName) {
  //       const filePath = 'images/song/' + this.fileName;
  //       const fileRef = this.storage.ref(filePath);
  //       const task = this.storage.upload(filePath, this.thisFile);
  //       // observe percentage changes
  //       this.uploadPercent = task.percentageChanges();
  //       task.snapshotChanges().pipe(
  //         finalize(() => {
  //           this.downLoadURL = fileRef.getDownloadURL();
  //           this.downLoadURL.subscribe((url) => {
  //             if (url) {
  //               this.imageUrl = url;
  //               // console.log(this.imageUrl);
  //               // console.log('thanh cong');
  //               // set image to dowloadURL cause it now from storage
  //               this.songService.formSong.controls.imageSong.setValue(this.imageUrl);
  //             }
  //           });
  //         })
  //       )
  //         .subscribe();
  //     }
  //     if (this.fileMp3Name) {
  //       const filePath = 'music/' + this.fileMp3Name;
  //       const fileRef = this.storage.ref(filePath);
  //       const taskMp3 = this.storage.upload(filePath, this.thisFileMp3);
  //       // observe percentage changes
  //       this.uploadMp3Percent = taskMp3.percentageChanges();
  //       taskMp3.snapshotChanges().pipe(
  //         finalize(() => {
  //           this.downLoadMp3URL = fileRef.getDownloadURL();
  //           this.downLoadMp3URL.subscribe((url) => {
  //             if (url) {
  //               this.mp3Url = url;
  //               // console.log(this.imageUrl);
  //               // console.log('thanh cong');
  //               // set image to dowloadURL cause it now from storage
  //               this.songService.formSong.controls.mp3Url.setValue(this.mp3Url);
  //             }
  //           });
  //         })
  //       )
  //         .subscribe();
  //     }
  //     if (this.fileVideoName) {
  //       const filePath = 'video/' + this.fileVideoName;
  //       const fileRef = this.storage.ref(filePath);
  //       const taskVideo = this.storage.upload(filePath, this.thisFileVideo);
  //       // observe percentage changes
  //       this.uploadVideoPercent = taskVideo.percentageChanges();
  //       taskVideo.snapshotChanges().pipe(
  //         finalize(() => {
  //           this.downLoadVideoURL = fileRef.getDownloadURL();
  //           this.downLoadVideoURL.subscribe((url) => {
  //             if (url) {
  //               this.videoUrl = url;
  //               // console.log(this.imageUrl);
  //               // console.log('thanh cong');
  //               // set image to dowloadURL cause it now from storage
  //               this.songService.formSong.controls.video.setValue(this.videoUrl);
  //             }
  //           });
  //         })
  //       )
  //         .subscribe();
  //     }
  //   });
  // }

  onSubmit() {
    // check valid form
    if (this.songService.formSong.valid) {
      // set value from id => name to formSong
      this.onSetValue();
      // Create
      if (!this.songService.formSong.controls.$key.value) {
        this.songService.listSong.add({
          name: this.songService.formSong.controls.name.value,
          albumId: this.songService.formSong.controls.albumId.value,
          imageSong: this.songService.formSong.controls.imageSong.value,
          mp3Url: this.songService.formSong.controls.mp3Url.value,

          performerId: this.songService.formSong.controls.performerId.value,
          video: this.songService.formSong.controls.video.value,
          like: this.songService.formSong.controls.like.value,
          view: this.songService.formSong.controls.view.value,
          lyric: this.songService.formSong.controls.lyric.value,

          countryId: this.songService.formSong.controls.countryId.value,

          userId: this.songService.formSong.controls.userId.value,

          songTypeId: this.songService.formSong.controls.songTypeId.value,
          comment: this.songService.formSong.controls.comment.value,
        }).then(res => {
          if (res) {
            this.afs.collection('Song').doc(res.id).update({
              album: this.songService.formSong.controls.album.value,
              performer: this.songService.formSong.controls.performer.value,
              country: this.songService.formSong.controls.country.value,
              user: this.songService.formSong.controls.user.value,
              songType: this.songService.formSong.controls.songType.value,
              id: res.id
            });

            if (this.fileName) {
              const filePath = 'images/song/' + this.fileName;
              const fileRef = this.storage.ref(filePath);
              const task = this.storage.upload(filePath, this.thisFile);
              // observe percentage changes
              this.uploadPercent = task.percentageChanges();
              task.snapshotChanges().pipe(
                finalize(() => {
                  this.downLoadURL = fileRef.getDownloadURL();
                  this.downLoadURL.subscribe((url) => {
                    if (url) {
                      this.imageUrl = url;
                      // console.log(this.imageUrl);
                      // console.log('thanh cong');
                      // set image to dowloadURL cause it now from storage
                      this.afs.collection('Song').doc(res.id).update({
                        imageSong: this.imageUrl
                      });
                    }
                  });
                })
              )
                .subscribe();
            }

            if (this.fileMp3Name) {
              const filePath = 'music/' + this.fileMp3Name;
              const fileRef = this.storage.ref(filePath);
              const taskMp3 = this.storage.upload(filePath, this.thisFileMp3);
              // observe percentage changes
              this.uploadMp3Percent = taskMp3.percentageChanges();
              taskMp3.snapshotChanges().pipe(
                finalize(() => {
                  this.downLoadMp3URL = fileRef.getDownloadURL();
                  this.downLoadMp3URL.subscribe((url) => {
                    if (url) {
                      this.mp3Url = url;
                      // console.log(this.imageUrl);
                      // console.log('thanh cong');
                      // set image to dowloadURL cause it now from storage
                      this.afs.collection('Song').doc(res.id).update({
                        mp3Url: this.mp3Url
                      });
                    }
                  });
                })
              )
                .subscribe();
            }

            if (this.fileVideoName) {
              const filePath = 'video/' + this.fileVideoName;
              const fileRef = this.storage.ref(filePath);
              const taskVideo = this.storage.upload(filePath, this.thisFileVideo);
              // observe percentage changes
              this.uploadVideoPercent = taskVideo.percentageChanges();
              taskVideo.snapshotChanges().pipe(
                finalize(() => {
                  this.downLoadVideoURL = fileRef.getDownloadURL();
                  this.downLoadVideoURL.subscribe((url) => {
                    if (url) {
                      this.videoUrl = url;
                      // console.log(this.imageUrl);
                      // console.log('thanh cong');
                      // set image to dowloadURL cause it now from storage
                      this.afs.collection('Song').doc(res.id).update({
                        video: this.videoUrl
                      });
                    }
                  });
                })
              )
                .subscribe();
            }

          }
        });
      }
    }
  }
}
