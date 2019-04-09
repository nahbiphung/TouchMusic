import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  user: Observable<User>;

  constructor(public afAuth: AngularFireAuth,
              public afs: AngularFirestore,
              public router: Router,
              public toastr: ToastrService) {
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

  // Register
  registerUser(email: string, pass: string, firstname: string, lastname: string, birthday: Date, phone: string) {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.createUserWithEmailAndPassword(email, pass)
        .then(userData => {
          this.updateUserData(userData.user, firstname, lastname, birthday, phone)
            .then(() => {
              this.closeModal();
              this.toastr.success('Create user thanh cong', 'Success');
              this.router.navigate(['/home']);
            });
        },
          err => reject(err));
    });
  }

  private updateUserData(user, firstName: string, lastName: string, birthday: Date, phone: string) {
    // set user data to firestore on login
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);

    const data: User = {
      uid: user.uid,
      email: user.email,
      firstName: firstName || null,
      lastName: lastName || null,
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

  // close Modal
  closeModal() {
    const modal = document.getElementById('loginModal');
    const modalback = document.querySelector('.modal-backdrop');
    modal.style.display = 'none';
    // modalback.setAttribute('style', 'display: none');
    modalback.remove();
  }

  loginEmail(email: string, pass: string) {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(email, pass)
        .then(userData => resolve(userData),
          err => reject(err));
    });
  }

  loginGoogle() {
    return this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then((credential) => {
        this.updateUserDataforAnotherService(credential.user);
      });
  }

  loginFacebook() {
    return this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
      .then((credential) => {
        this.updateUserDataforAnotherService(credential.user);
      });
  }

  private updateUserDataforAnotherService(user) {
    // set user data to firestore on login
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);

    const data: User = {
      uid: user.uid,
      email: user.email,
      firstName: user.firstName || null,
      lastName: user.lastName || null,
      birthday: user.birthday || null,
      phone: user.phone || null,
      photoURL: user.photoURL,
      role: {
        subscriber: true,
        admin: false
      }
    };

    return userRef.set(data, { merge: true });
  }

  logout() {
    return this.afAuth.auth.signOut().then(() => {
      this.router.navigate(['/']);
    });
  }

  getAuth() {
    return this.user = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }
}
