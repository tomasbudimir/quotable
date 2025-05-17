import { Timestamp } from "@angular/fire/firestore";

export interface QuoteRecord {
    id: string;                 // unique document id 
    uid: string;                // user uid
    displayName: string;        // user display name
    quotedBy: string;           // name of the person the quote is attributed to
    created: Timestamp;         // when was quote crested
    quoteText: string;          // text of the quote
    url: string;                // background image url behinf the quote
}