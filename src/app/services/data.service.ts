import { doc, Firestore, setDoc, arrayUnion, updateDoc, serverTimestamp, getDoc } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private firestore: Firestore) { }

  setUser(uid: string, email: string, displayName: string) {
    const ref = doc(this.firestore, 'users/' + uid);
    setDoc(ref, { email, displayName }, { merge: true });
  }

  setPhotoURL(uid: string, photoURL: string) {
    const ref = doc(this.firestore, 'users/' + uid);
    setDoc(ref, { photoURL }, { merge: true });
  }

  setLoggedInDate(uid: string) {
    const ref = doc(this.firestore, 'users/' + uid);
    const lastLogin = serverTimestamp();
    setDoc(ref, { lastLogin }, { merge: true });
  }

  async setDateUserJoined(uid: string) {
    const ref = doc(this.firestore, 'users/' + uid);
    const record = await getDoc(ref);

    if (record.exists()) {
      const data = record.data();

      if ('joined' in data) {
        // Joined date already set in user document
        return;
      }
      
      const joined = serverTimestamp();

      setDoc(ref, { joined }, { merge: true });
    }
  }
}
