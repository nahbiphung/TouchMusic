import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  public userList: AngularFirestoreCollection<any>;
  photoURL: Observable<string>;
  constructor(private afs: AngularFirestore) { }

  form: FormGroup = new FormGroup({
    $key: new FormControl(null),
    email: new FormControl('', [Validators.email, Validators.required]),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    birthday: new FormControl(''),
    phone: new FormControl('', [Validators.required, Validators.minLength(8)]),
    photoURL: new FormControl(''),
    admin: new FormControl(false),
    subscriber: new FormControl(true)
  });

  initializeFormGroup() {
    this.form.setValue({
      $key: null,
      email: '',
      firstName: '',
      lastName: '',
      birthday: '',
      phone: '',
      photoURL: '',
      role: {
        subscriber: true,
        admin: false
      }
    });
  }

  getUsers() {
    this.userList = this.afs.collection('users');
    return this.userList.snapshotChanges();
  }

  addUser(data: any) {
    this.userList.add({
      uid: '',
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      birthday: data.birthday,
      phone: data.phone,
      photoURL: this.photoURL,
      role: {
        subscriber: true,
        admin: false
      }
    }).then(res => {
      if (res) {
        this.afs.collection('users').doc(res.id).update({
          uid: res.id
        });
      }
    });
  }
}
