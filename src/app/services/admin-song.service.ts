import { Injectable } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AdminSongService {

  imageURL: string;
  listSong: AngularFirestoreCollection<any>;

  constructor(
    private afs: AngularFirestore,
  ) { }

  formSong: FormGroup = new FormGroup({
    $key: new FormControl(null),
    id: new FormControl(''),
    name: new FormControl(''),
    albumId: new FormControl(''),
    imageSong: new FormControl(''),
    mp3Url: new FormControl(''),
    performerId: new FormControl(''),
    video: new FormControl(''),
    like: new FormControl(''),
    view: new FormControl(''),
    lyric: new FormControl(''),
    countryId: new FormControl(''),
    userId: new FormControl(''),
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
        this.addSubComment()
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
      albumId: '',
      imageSong: '',
      mp3Url: '',
      performerId: '',
      video: '',
      like: '',
      vieww: '',
      lyric: '',
      countryId: '',
      userId: '',
      songTypeId: '',
    });
  }

  getSong() {
    this.listSong = this.afs.collection('Song');
    return this.listSong.snapshotChanges();
  }

  createAlbum() {
    this.listSong.add({
      name: this.formSong.controls.name.value,
      album: this.formSong.controls.name.value,
      albumId: this.formSong.controls.name.value,
      imageSong: this.formSong.controls.name.value,
      mp3Url: this.formSong.controls.mp3Url.value,
      performerId: this.formSong.controls.name.value,
      video: this.formSong.controls.name.value,
      like: this.formSong.controls.name.value,
      vieww: this.formSong.controls.name.value,
      lyric: this.formSong.controls.name.value,
      countryId: this.formSong.controls.name.value,
      userId: this.formSong.controls.name.value,
    }).then(res => {
      if (res) {
        this.afs.collection('Song').doc(res.id).update({
          id: res.id
        });
       }
    });
  }

  popupForm(element) {
    this.imageURL = element.image;
    this.formSong.setValue({
      $key: element.$key,
      id: element.id,
      name: element.name,
      image: element.image,
      performerId: element.performerId.id,
      userId: element.userId.id
    });
  }

  updateAlbum() {
    this.afs.collection('Song').doc(this.formSong.controls.$key.value).update({

    });
  }

  deleteAlbum(id: string) {
    this.afs.collection('Song').doc(id).delete();
  }
}
