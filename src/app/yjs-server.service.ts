import { Injectable } from '@angular/core';
import * as yjs from 'yjs';
import { WebsocketProvider } from 'y-websocket/src/y-websocket.js';


@Injectable({
  providedIn: 'root'
})
export class YjsServerService {

  private doc = new yjs.Doc();
  private displayedText = 'Nothing';
 // private wsProvider = new WebsocketProvider('ws://localhost:1234', 'my-roomname', this.doc);
  constructor() {
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
    doc2.getArray('myarray').get(0); // => 'Hello doc2, you got this?'

  }
}
