import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SongTypeService {

  constructor(
    private afs: AngularFirestore,
  ) { }

  formSongtype: FormGroup = new FormGroup({
    $key: new FormControl(null),
    id: new FormControl(''),
    name: new FormControl('', Validators.required)
  });

  formReset() {
    this.formSongtype.setValue({
      $key: null,
      id: '',
      name: ''
    });
  }
  getSongType() {
    return this.afs.collection('SongType').snapshotChanges();
  }

  createSongType() {
    this.afs.collection('SongType').add({
      name: this.formSongtype.controls.name.value
    }).then(res => {
      if (res) {
        this.afs.collection('SongType').doc(res.id).update({
          id: res.id
        });
       }
    });
  }

  popupForm(element) {
    this.formSongtype.setValue(element);
  }

  updateSongType() {
    this.afs.collection('SongType').doc(this.formSongtype.controls.$key.value).update({
      name: this.formSongtype.controls.name.value
    });
  }

  deleteSongType(id: string) {
    this.afs.collection('SongType').doc(id).delete();
  }
}
