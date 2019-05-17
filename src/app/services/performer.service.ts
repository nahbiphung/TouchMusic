import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class PerformerService {

  constructor(
    private afs: AngularFirestore
  ) { }

  formPerformer: FormGroup = new FormGroup({
    $key: new FormControl(null),
    id: new FormControl(''),
    birthday: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    countryId: new FormControl('', Validators.required)
  });

  formReset() {
    this.formPerformer.setValue({
      $key: null,
      id: '',
      birthday: '',
      name: '',
      countryId: ''
    });
  }

  getPerformer() {
    return this.afs.collection('Performer').snapshotChanges();
  }

  createPerformer() {
    this.afs.collection('Performer').add({
      birthday: this.formPerformer.controls.birthday.value,
      name: this.formPerformer.controls.name.value,
      countryId: this.afs.collection('Country').doc(this.formPerformer.controls.countryId.value).ref
    }).then(res => {
      if (res) {
        this.afs.collection('Performer').doc(res.id).update({
          id: res.id
        });
       }
    });
  }

  popupForm(element) {
    this.formPerformer.setValue({
      $key: element.$key,
      id: element.id,
      birthday: element.birthday,
      name: element.name,
      countryId: element.countryId.id
    });
  }

  updatePerformer() {
    this.afs.collection('Performer').doc(this.formPerformer.controls.$key.value).update({
      birthday: this.formPerformer.controls.birthday.value,
      name: this.formPerformer.controls.name.value,
      countryId: this.afs.collection('Country').doc(this.formPerformer.controls.countryId.value).ref
    });
  }

  deletePerformer(id: string) {
    this.afs.collection('Performer').doc(id).delete();
  }
}
