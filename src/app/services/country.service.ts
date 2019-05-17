import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  imageURL: string;

  constructor(
    private afs: AngularFirestore
  ) { }

  formCountry: FormGroup = new FormGroup({
    $key: new FormControl(null),
    id: new FormControl(''),
    image: new FormControl(''),
    name: new FormControl('', Validators.required)
  });

  formReset() {
    this.formCountry.setValue({
      $key: null,
      id: '',
      image: '',
      name: ''
    });
  }

  getCountry() {
    return this.afs.collection('Country').snapshotChanges();
  }

  createCountry() {
    this.afs.collection('Country').add({
      image: this.formCountry.controls.image.value,
      name: this.formCountry.controls.name.value
    }).then(res => {
      if (res) {
        this.afs.collection('Country').doc(res.id).update({
          id: res.id
        });
       }
    });
  }

  popupForm(element) {
    this.formCountry.setValue(element);
    this.imageURL = element.image;
    console.log(this.imageURL);
  }

  updateCountry() {
    this.afs.collection('Country').doc(this.formCountry.controls.$key.value).update({
      image: this.formCountry.controls.image.value,
      name: this.formCountry.controls.name.value
    });
  }

  deleteCountry(id: string) {
    this.afs.collection('Country').doc(id).delete();
  }
}
