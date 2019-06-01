import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AdminAlbumService {

  imageURL: string;
  listAlbum: AngularFirestoreCollection<any>;

  constructor(
    private afs: AngularFirestore
  ) { }

  formAlbum: FormGroup = new FormGroup({
    $key: new FormControl(null),
    id: new FormControl(''),
    name: new FormControl('', Validators.required),
    image: new FormControl('', Validators.required),
    performerId: new FormControl(''),
    userId: new FormControl('')
  });

  formReset() {
    this.formAlbum.setValue({
      $key: null,
      id: '',
      name: '',
      image: '',
      performerId: '',
      userId: '',
    });
  }

  getAlbum() {
    this.listAlbum = this.afs.collection('Album');
    return this.listAlbum.snapshotChanges();
  }

  createAlbum() {
    this.listAlbum.add({
      name: this.formAlbum.controls.name.value,
      image: this.formAlbum.controls.image.value,
      performerId: this.afs.collection('Performer').doc(this.formAlbum.controls.performerId.value).ref,
      userId: this.afs.collection('users').doc(this.formAlbum.controls.userId.value).ref
    }).then(res => {
      if (res) {
        this.afs.collection('Album').doc(res.id).update({
          id: res.id
        });
       }
    });
  }

  popupForm(element) {
    this.imageURL = element.image;
    this.formAlbum.setValue({
      $key: element.$key,
      id: element.id,
      name: element.name,
      image: element.image,
      performerId: element.performerId.id,
      userId: element.userId.id
    });
  }

  updateAlbum() {
    this.afs.collection('Album').doc(this.formAlbum.controls.$key.value).update({
      name: this.formAlbum.controls.name.value,
      image: this.formAlbum.controls.image.value,
      performerId: this.afs.collection('Performer').doc(this.formAlbum.controls.performerId.value).ref,
      userId: this.afs.collection('users').doc(this.formAlbum.controls.userId.value).ref
    });
  }

  deleteAlbum(id: string) {
    this.afs.collection('Album').doc(id).delete();
  }
}
