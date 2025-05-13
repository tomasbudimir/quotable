import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile, User } from '@angular/fire/auth';

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

  logout() {
    return signOut(this.auth);
  }

  updateDisplayName(displayName: string) {
    if (this.currentUser) {
      updateProfile(this.currentUser, { displayName });
    }
  }

  updatePhotoURL(photoURL: string) {
    if (this.currentUser) {
      updateProfile(this.currentUser, { photoURL });
    }
  }

  get user(): User {
    return this.currentUser;
  }

  get photoURL(): string {
    if (this.currentUser?.photoURL && this.currentUser.photoURL.startsWith('http')) {
      return this.currentUser.photoURL;
    }

    return '/assets/nophoto.svg';
  }
}
