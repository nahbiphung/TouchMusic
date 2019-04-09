import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  user: Observable<User>;

  constructor(public afAuth: AngularFireAuth,
              public afs: AngularFirestore,
              public router: Router) {
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

  registerUser(email: string, pass: string, firstname: string, lastname: string, birthday: Date, phone: string) {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.createUserWithEmailAndPassword(email, pass)
        .then(userData => {
          this.updateUserData(userData.user, firstname, lastname, birthday, phone)
            .then(() =>
              this.router.navigate(['/home']));
        },
          err => reject(err));
    });
  }

  private updateUserData(user, firstname: string, lastname: string, birthday: Date, phone: string) {
    // set user data to firestore on login
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);

    const data: User = {
      uid: user.uid,
      email: user.email,
      firstName: firstname || null,
      lastName: lastname || null,
      birthday: birthday || null,
      phone: phone || null,
      photoURL: user.photoURL,
      role: {
        subscriber: true,
        admin: false
      }
    };

    return userRef.set(data, { merge: true });
  }
}
