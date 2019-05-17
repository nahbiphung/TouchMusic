import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastrService, Toast } from 'ngx-toastr';
import { switchMap } from 'rxjs/operators';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  imageURL: string;
  user: Observable<User>;
  public userList: AngularFirestoreCollection<any>;
  photoURL: Observable<string>;

  constructor(private afs: AngularFirestore,
              private afAuth: AngularFireAuth,
              private toastr: ToastrService) {
    //// Get auth data, then get firestore user document || null
    this.user = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  formUser: FormGroup = new FormGroup({
    $key: new FormControl(null),
    email: new FormControl('', [Validators.required, Validators.email]),
    // password: new FormControl('', Validators.minLength(8)),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    displayName: new FormControl(''),
    birthday: new FormControl('', Validators.required),
    phone: new FormControl('', [Validators.required, Validators.minLength(8)]),
    photoURL: new FormControl(''),
    role: new FormGroup({
      admin: new FormControl(''),
      subscriber: new FormControl('')
    }),
    uid: new FormControl('')
  });

  initializeFormGroup() {
    this.formUser.setValue({
      $key: null,
      email: '',
      // password: '',
      firstName: '',
      lastName: '',
      displayName: '',
      birthday: '',
      phone: '',
      photoURL: '',
      role: {
        subscriber: true,
        admin: false
      },
      uid: ''
    });
  }

  getUsers() {
    this.userList = this.afs.collection('users');
    return this.userList.snapshotChanges();
  }

  popupForm(element) {
    this.formUser.setValue(element);
    this.imageURL = element.photoURL;
  }

  updateUser(user) {
    this.userList.doc(user.$key).update({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      displayName: user.firstName + ' ' + user.lastName,
      birthday: user.birthday,
      phone: user.phone,
      photoURL: user.photoURL,
      role: {
        admin: user.role.admin,
        subscriber: user.role.subscriber
      },
    });
  }

  deleteUser(id: string) {
    this.userList.doc(id).delete();
  }

}
