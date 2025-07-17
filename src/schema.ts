import { books } from "./data.js";
import { PubSub } from "graphql-subscriptions";


export const pubsub :any= new PubSub();
    // console.log("PubSub type:", typeof pubsub);
    // console.log("Has asyncIterator?", typeof pubsub.asyncIterator);
const BOOK_ADDED = "BOOK_ADDED";
const BOOK_DELETED = "BOOK_DELETED";
const BOOK_UPDATED = "BOOK_UPDATED";
export const typeDefs = `#graphql

type Book {
id:ID!
title:String!
author:String
}

type Query {     
         allBooks: [Book] 
         book(id: ID!): Book   
         booksByAuthor(author: String!): [Book]
         title(id: ID!): String
         getAllBooksID : [ID!]!
    }
         
     type Mutation {
   addBook(id: ID!, title: String!, author: String): Book
   updateBook(id:ID!,title:String,author:String):Book
   deleteBook(id:ID!):String
   deleteBooksByAuthor(author : String!):[Book]
 }
    
 type Subscription {
        bookAdded: Book
        bookDeleted :String
        bookUpdated : Book
 }`;

 export const resolvers = {
    Query : {
     allBooks: () => books,   
     book: (_: any,{ id }: { id: string }) => books.find((b:any) =>{
          return b.id === id;
     }),
   booksByAuthor: (_: any,{ author }: { author: string }) => {
     if(author) return books.filter((b:any) => b.author === author);
     else return [];
 },

     title:(_: any,{id}:{id:string})=> {
         const res =  books.find((b:any)=>b.id===id);
         return res? res.title: null ;
     },
     getAllBooksID:()=>{
         return books.map((x:any)=>x.id);
     }
    },
     Mutation: {
     addBook:(_: any,{id,title,author}:{id:string,title:string,author:string})=>{
         const alreadyThere  = books.find((x:any)=>x.id===id);
         if(alreadyThere) {
             alreadyThere.title = title;
             alreadyThere.author = author;
             return alreadyThere;
         }
         const newBook = {id,title,author};
         if(!id|| !author || !title)  return "problem";
         books.push(newBook);
         //after implementing susbscription type this below new pubsub line
         

         pubsub.publish(BOOK_ADDED, { bookAdded: newBook });
         return newBook;
     },
     updateBook :(_: any,{id,title,author}:{id:string,title:string,author:string})=>{
         const updBook = books.find((x:any)=>x.id===id);
         if(!updBook) {
             throw new Error("not found , first create one");
         } 
        if(title!==undefined) updBook.title = title;
        if(author!==undefined) updBook.author = author;
         pubsub.publish(BOOK_UPDATED, { bookUpdated: updBook });
         return updBook;
     },
     deleteBook :(_: any,{id}:{id:string})=>{
         const delBookIndex = books.findIndex((x:any)=>x.id===id);
          console.log("delBook",delBookIndex);
         if(delBookIndex===-1) throw new Error("not found , first create one");

         const var2 = books[delBookIndex];
         books.splice(delBookIndex,1);
            //after implementing susbscription type this below new pubsub line
            pubsub.publish(BOOK_DELETED, { bookDeleted: id });
          return `Book with ID ${id} has been deleted`+var2;
     },
     deleteBooksByAuthor :(_: any,{author}:{author:string})=> {
         const delBooks = books.filter((x:any)=>x.author === author);
         if(delBooks.length === 0) throw new Error("not found , first create one");

         for (let i = books.length - 1; i >= 0; i--) {
                 if (books[i].author === author) {
                         books.splice(i, 1);
                }
        }
         return delBooks;
       }
    },
    Subscription: {
        bookAdded: {
            subscribe: () => pubsub.asyncIterator([BOOK_ADDED]),
        },
        bookDeleted :{
            subscribe: () => pubsub.asyncIterator([BOOK_DELETED]),
        },
        bookUpdated :{
            subscribe: () => pubsub.asyncIterator([BOOK_UPDATED]),
        }
    },
    
 }