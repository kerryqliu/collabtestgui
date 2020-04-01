import { Injectable } from '@angular/core';
import * as yjs from 'yjs';
import { WebsocketProvider } from 'y-websocket/src/y-websocket.js';


@Injectable({
  providedIn: 'root'
})
export class YjsServerService {


  //try out the websocket next
  private doc = new yjs.Doc();
  private displayedText = 'Nothing';
  // can first try update listener and just log when one client makes a change
  // private wsProvider = new WebsocketProvider('ws://localhost:1234', 'my-roomname', this.doc);
  constructor() {

  //  this.wsProvider.on('status', event => {
  //    console.log(event); // logs "connected" or "disconnected"
  //  });

  //  this.wsProvider.on('update', event => {
  //    console.log('event');
  //    console.log('DOC UPDATED');
  //  });

    const doc1 = new yjs.Doc();
    const doc2 = new yjs.Doc();

    doc1.on('update', update => {
      yjs.applyUpdate(doc2, update);
    });

    doc2.on('update', update => {
      yjs.applyUpdate(doc1, update);
    });

// All changes are also applied to the other document
    doc1.getArray('myarray').insert(0, ['Hello doc2, you got this?']);
    console.log(doc2.getArray('myarray').get(0)); // => 'Hello doc2, you got this?'
    console.log(doc1.getArray('myarray').get(0));
    this.doc.getArray('testarray').insert(0, ['hi']);

  }
}
