import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, FacebookAuthProvider, GoogleAuthProvider, onAuthStateChanged, 
  signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile, User } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUser: User;

  constructor(private auth: Auth) { 
    onAuthStateChanged(auth, user => {
      if (user) {
        // User signed in
        console.log("User logged in:", user);
        this.currentUser = user;
      } else {
        // User signed out
        console.log("User not logged in");
        this.currentUser = null;
      }
    });
  }

  register(username: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, username, password);
  }

  login(username: string, password: string) {
    return signInWithEmailAndPassword(this.auth, username, password);
  }

  loginWithGoogle() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  loginWithFacebook() {
    return signInWithPopup(this.auth, new FacebookAuthProvider());
  }

  logout() {
    return signOut(this.auth);
  }

  updateDisplayName(displayName: string) {
    if (this.user) {
      updateProfile(this.user, { displayName });
    }
  }

  updatePhotoURL(photoURL: string) {
    if (this.user) {
      updateProfile(this.user, { photoURL });
    }
  }

  get user(): User {
    return this.currentUser;
  }

  get displayName(): string {
    return this.user?.displayName;
  }

  get photoURL(): string {
    if (this.user?.photoURL && this.user.photoURL.startsWith('http')) {
      return this.user.photoURL;
    }

    return '/assets/nophoto.svg';
  }
}
