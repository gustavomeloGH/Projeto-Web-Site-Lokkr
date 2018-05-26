import { Injectable } from '@angular/core';

import * as firebase from 'firebase';

@Injectable()
export class AuthService {
  constructor() {}

  signupUser(email, password) {
    return new Promise<any>((resolve, reject) => {
        firebase.auth().createUserWithEmailAndPassword(email, password)
          .then(() => resolve())
          .catch(error => reject(error));
    });
  }

  signinUser(email, password) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(email, password)
        .then(() => resolve())
          .catch(error => reject(error));
    });
  }

  logout() {
    return new Promise<void>((resolve, reject) => {
            firebase.auth().signOut()
                .then(() => resolve())
                .catch(error => reject(error))
    });
  }

  getCurrentUser(): any {
    return new Promise<void>((resolve) => {
      firebase.auth().onAuthStateChanged(user => {
         resolve(user);
      });
    });
  }

// tslint:disable-next-line:eofline
}