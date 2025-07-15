import { AuthService } from './auth.service';
import { doc, Firestore, setDoc, serverTimestamp, getDoc, collection, collectionData, docData, orderBy, query, addDoc, deleteDoc, where, arrayUnion, arrayRemove, DocumentData, DocumentReference, limit, getCountFromServer } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { QUOTES, USERS } from '../models/constants';
import { map, Observable, switchMap } from 'rxjs';
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

  async getQuoteCount(): Promise<number> {
    const ref = collection(this.firestore, QUOTES);
    const snapshot = await getCountFromServer(ref);
    return snapshot.data().count;
  }

  getUnsortedQuotes(): Observable<QuoteRecord[]> {
    const ref = collection(this.firestore, QUOTES);
    let q = query(ref, where('isPrivate', '==', false));

    return collectionData(q) as Observable<QuoteRecord[]>;
  }

  getQuotes(top?: number): Observable<QuoteRecord[]> {
    const ref = collection(this.firestore, QUOTES);
    let q = query(ref, where('isPrivate', '==', false), orderBy('created', 'desc'));

    if (top) {
      q = query(ref, where('isPrivate', '==',  false), orderBy('created', 'desc'), limit(top));
    }

    return collectionData(q, { idField: 'id' }) as Observable<QuoteRecord[]>
  }

  getQuotesSortedByLikes(): Observable<QuoteRecord[]> {
    const ref = collection(this.firestore, QUOTES);
    const q = query(ref, where('isPrivate', '==',  false),
      orderBy('likesCount', 'desc'),
      orderBy('created', 'desc'));
    return collectionData(q, { idField: 'id'}) as Observable<QuoteRecord[]>;
  }

  getQuotesILiked(): Observable<QuoteRecord[]> {
    const ref = collection(this.firestore, QUOTES);
    const q = query(ref, where('likes', 'array-contains', this.authService.user.uid),
      orderBy('likesCount', 'desc'),
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
  
  getPrivateQuotes(): Observable<QuoteRecord[]> {
    const ref = collection(this.firestore, QUOTES);
    const q = query(ref, 
      where('uid', '==',  this.authService.user.uid), 
      where('isPrivate', '==',  true), 
      orderBy('created', 'desc'));
    return (collectionData(q, { idField: 'id'}) as Observable<QuoteRecord[]>);
  }

  getQuotesByQuotedBy(quotedBy: string): Observable<QuoteRecord[]> {
    const ref = collection(this.firestore, QUOTES);
    const q = query(ref, 
      where('quotedBy', '==', quotedBy),
      orderBy('created', 'desc'));
    return (collectionData(q, { idField: 'id'}) as Observable<QuoteRecord[]>).pipe(
      map(items => items.filter(item => !item.isPrivate))
    );
  }

  getQuoteById(id: string): Observable<QuoteRecord> {
    const ref = doc(this.firestore, QUOTES, id);
    return docData(ref, { idField: 'id'}) as Observable<QuoteRecord>;
  }

  getAuthors(): Observable<{name: string, count: number}[]> {
    const ref = collection(this.firestore, QUOTES);
    return collectionData(ref).pipe(
      map((quotes: QuoteRecord[]) => {
        const counts: Record<string, number> = {};

        for (const quote of quotes) {
          const name = quote.quotedBy;
          counts[name] = (counts[name] || 0) + 1;
        }

        return Object.entries(counts) 
          .map(([name, count]) => ({ name, count }))
          //.sort((a, b) => b.count - a.count); // Sort descending by count
          .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically
      })
    );
  }

  async createQuote(quoteText: string, quotedBy: string, url: string, isPrivate: boolean) {
    const ref = collection(this.firestore, QUOTES);

    const isMyQuote = quotedBy == this.authService.displayName;

    const quote = {
      uid: this.authService?.user?.uid,
      displayName: this.authService.displayName,
      quoteText,
      quotedBy, 
      created: serverTimestamp(),
      url,
      isMyQuote,
      isPrivate,
      likesCount: 0
    } as QuoteRecord;

    await addDoc(ref, quote);
  }

  async updateQuote(id: string, quoteText: string, quotedBy: string, url: string, isPrivate: boolean) {
    const isMyQuote = quotedBy == this.authService.displayName;

    const ref = doc(this.firestore, QUOTES, id);
    await setDoc(ref, { quoteText, quotedBy, url, isMyQuote, isPrivate }, { merge: true });

    await this.updateLikesCount(ref);
  }

  async deleteQuote(id: string) {
    const ref = doc(this.firestore, QUOTES, id);
    await deleteDoc(ref);
  }

  async likeTheQuote(quote: QuoteRecord) {
    const ref = doc(this.firestore, QUOTES, quote.id);
    await setDoc(ref, { likes: arrayUnion(this.authService.user.uid) }, { merge: true });

    await this.updateLikesCount(ref);
  }

  async unlikeTheQuote(quote: QuoteRecord) {
    const ref = doc(this.firestore, QUOTES, quote.id);
    await setDoc(ref, { likes: arrayRemove(this.authService.user.uid) }, { merge: true });

    await this.updateLikesCount(ref);
  }

  private async updateLikesCount(ref: DocumentReference<DocumentData, DocumentData>) {
    const document = await getDoc(ref);
    const record = document.data() as QuoteRecord;
    const count = record.likes == null ? 0 : record.likes.length;

    await setDoc(ref, { likesCount: count }, { merge: true });
  }
}
