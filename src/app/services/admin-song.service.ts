import { Injectable } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AdminSongService {

  imageURL: string;
  songURL: string;
  videoURL: string;
  listSong: AngularFirestoreCollection<any>;

  constructor(
    private afs: AngularFirestore,
  ) { }

  formSong: FormGroup = new FormGroup({
    $key: new FormControl(null),
    id: new FormControl(''),
    name: new FormControl('', Validators.required),
    album: new FormControl(''),
    albumId: new FormControl(''),
    imageSong: new FormControl('', Validators.required),
    mp3Url: new FormControl('', Validators.required),
    performer: new FormControl(''),
    performerId: new FormControl(''),
    video: new FormControl(''),
    like: new FormControl(''),
    view: new FormControl(''),
    lyric: new FormControl(''),
    country: new FormControl(''),
    countryId: new FormControl(''),
    user: new FormControl(''),
    userId: new FormControl('', Validators.required),
    songType: new FormControl(''),
    songTypeId: new FormControl(''),
    comment: new FormArray([
      // this.addComment()
    ])
  });

  addComment(): FormGroup {
    return new FormGroup ({
      commentId: new FormControl(''),
      content: new FormControl(''),
      like: new FormControl(''),
      postDate: new FormControl(''),
      user: new FormControl(''),
      userAvatar: new FormControl(''),
      subComment: new FormArray([
        // this.addSubComment()
      ])
    });
  }

  addSubComment(): FormGroup {
    return new FormGroup ({
      subCommentId: new FormControl(''),
      content: new FormControl(''),
      like: new FormControl(''),
      postDate: new FormControl(''),
      user: new FormControl(''),
      userAvatar: new FormControl(''),
    });
  }

  formReset() {
    this.formSong.setValue({
      $key: null,
      id: '',
      name: '',
      album: '',
      albumId: '',
      imageSong: '',
      mp3Url: '',
      performer: '',
      performerId: '',
      video: '',
      like: 0,
      view: 0,
      lyric: '',
      country: '',
      countryId: '',
      user: '',
      userId: '',
      songType: '',
      songTypeId: '',
      comment: [],
    });
  }

  getSong() {
    this.listSong = this.afs.collection('Song');
    return this.listSong.snapshotChanges();
  }

  // createSong() {
  //   this.listSong.add({
  //     name: this.formSong.controls.name.value,
  //     album: this.formSong.controls.name.value,
  //     albumId: this.formSong.controls.albumId.value,
  //     imageSong: this.formSong.controls.imageSong.value,
  //     mp3Url: this.formSong.controls.mp3Url.value,
  //     performer: this.formSong.controls.performer.value,
  //     performerId: this.formSong.controls.performerId.value,
  //     video: this.formSong.controls.video.value,
  //     like: this.formSong.controls.like.value,
  //     view: this.formSong.controls.view.value,
  //     lyric: this.formSong.controls.lyric.value,
  //     country: this.formSong.controls.country.value,
  //     countryId: this.formSong.controls.countryId.value,
  //     user: this.formSong.controls.user.value,
  //     userId: this.formSong.controls.userId.value,
  //     songType: this.formSong.controls.songType.value,
  //     songTypeId: this.formSong.controls.songTypeId.value,
  //     comment: this.formSong.controls.comment.value,
  //   }).then(res => {
  //     if (res) {
  //       this.afs.collection('Song').doc(res.id).update({
  //         id: res.id
  //       });
  //      }
  //   });
  // }

  popupForm(element) {
    console.log(element);
    this.imageURL = element.imageSong;
    this.songURL = element.mp3Url;
    this.videoURL = element.video;
    this.formSong.setValue({
      $key: element.$key,
      id: element.id,
      name: element.name,
      album: element.albumName,
      albumId: element.albumId.id,
      imageSong: element.imageSong,
      mp3Url: element.mp3Url,
      performer: element.performerName,
      performerId: element.performerId.id,
      video: element.video,
      like: element.like,
      view: element.view,
      lyric: element.lyric,
      country: element.countryName,
      countryId: element.countryId.id,
      user: element.userName,
      userId: element.userId.id,
      songType: element.songTypeName,
      songTypeId: element.songTypeId.id,
      comment: element.comment
    });
  }

  // updateSong() {
  //   this.afs.collection('Song').doc(this.formSong.controls.$key.value).update({

  //   });
  // }

  deleteSong(id: string) {
    this.afs.collection('Song').doc(id).delete();
  }
}
