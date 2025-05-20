import { AuthService } from './auth.service';
import { doc, Firestore, setDoc, serverTimestamp, getDoc, collection, collectionData, docData, orderBy, query, addDoc, deleteDoc, where } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { QUOTES, USERS } from '../models/constants';
import { filter, map, Observable } from 'rxjs';
import { UserRecord } from '../models/user-record';
import { QuoteRecord } from '../models/quote-record';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  
  constructor(private firestore: Firestore,
    private authService: AuthService
  ) { }

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

  getQuotes(): Observable<QuoteRecord[]> {
    const ref = collection(this.firestore, QUOTES);
    const q = query(ref, 
      orderBy('created', 'desc'));
    return collectionData(q, { idField: 'id'}) as Observable<QuoteRecord[]>;
  }

  getQuotesPostedByMe(): Observable<QuoteRecord[]> {
    const ref = collection(this.firestore, QUOTES);
    const q = query(ref, 
      where('uid', '==',  this.authService.user.uid), 
      orderBy('created', 'desc'));
    return collectionData(q, { idField: 'id'}) as Observable<QuoteRecord[]>;
  }

  getMyOwnQuotes(): Observable<QuoteRecord[]> {
    const ref = collection(this.firestore, QUOTES);
    const q = query(ref, 
      where('uid', '==',  this.authService.user.uid), 
      where('isMyQuote', '==',  true), 
      orderBy('created', 'desc'));
    return (collectionData(q, { idField: 'id'}) as Observable<QuoteRecord[]>);
  }
  

  getQuoteById(id: string): Observable<QuoteRecord> {
    const ref = doc(this.firestore, QUOTES, id);
    return docData(ref, { idField: 'id'}) as Observable<QuoteRecord>;
  }

  async createQuote(quoteText: string, quotedBy: string, url: string) {
    const ref = collection(this.firestore, QUOTES);

    const isMyQuote = quotedBy == this.authService.displayName;

    const quote = {
      uid: this.authService?.user?.uid,
      displayName: this.authService.displayName,
      quoteText,
      quotedBy, 
      created: serverTimestamp(),
      url,
      isMyQuote
    } as QuoteRecord;

    await addDoc(ref, quote);
  }

  async updateQuote(id: string, quoteText: string, quotedBy: string, url: string) {
    const isMyQuote = quotedBy == this.authService.displayName;

    const ref = doc(this.firestore, QUOTES, id);
    await setDoc(ref, { quoteText, quotedBy, url, isMyQuote }, { merge: true });
  }

  async deleteQuote(id: string) {
    const ref = doc(this.firestore, QUOTES, id);
    await deleteDoc(ref);
  }
}
