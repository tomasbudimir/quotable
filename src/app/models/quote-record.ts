import { Timestamp } from "@angular/fire/firestore";

export interface QuoteRecord {
    id: string;                 // unique document id 
    uid: string;                // user (quote creator) uid
    displayName: string;        // user display name
    quoteText: string;          // text of the quote
    quotedBy: string;           // name of the person the quote is attributed to
    created: Timestamp;         // when was quote crested
    url: string;                // background image url behind the quote
    isMyQuote: boolean;         // the person the quote is attributed to is me
    isPrivate: boolean;         // the quote attributed to me visible on the web site by me only
    likes: string[];            // list of uids of users who liked this quote
}