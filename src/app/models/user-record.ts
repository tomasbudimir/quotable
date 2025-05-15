import { Timestamp } from "@angular/fire/firestore";

export interface UserRecord {
    uid: string;
    displayName: string;
    email: string;
    joined: Timestamp;
    lastLogin: Timestamp;
    photoURL: string;
}