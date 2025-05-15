import { doc, Firestore, setDoc, serverTimestamp, getDoc, collection, collectionData, docData } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { USERS } from '../models/constants';
import { Observable } from 'rxjs';
import { UserRecord } from '../models/user-record';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private firestore: Firestore) { }

  setUser(uid: string, email: string, displayName: string) {
    const ref = doc(this.firestore, USERS, uid);
    setDoc(ref, { email, displayName }, { merge: true });
  }

  setPhotoURL(uid: string, photoURL: string) {
    const ref = doc(this.firestore, USERS, uid);
    setDoc(ref, { photoURL }, { merge: true });
  }

  setLoggedInDate(uid: string) {
    const ref = doc(this.firestore, USERS, uid);
    const lastLogin = serverTimestamp();
    setDoc(ref, { lastLogin }, { merge: true });
  }

  async setDateUserJoined(uid: string) {
    const ref = doc(this.firestore, USERS, uid);
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

  getUsers() : Observable<UserRecord[]> {
    const ref = collection(this.firestore, USERS);
    return collectionData(ref, { idField: 'uid'}) as Observable<UserRecord[]>;
  }

  getUser(uid: string) : Observable<UserRecord> {
    const ref = doc(this.firestore, USERS, uid);
    return docData(ref, { idField: 'uid'}) as Observable<UserRecord>;
  }
}
