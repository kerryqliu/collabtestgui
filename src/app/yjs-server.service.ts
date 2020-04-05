import { Injectable } from '@angular/core';
import * as yjs from 'yjs';
import * as automerge from 'automerge';
import { WebsocketProvider } from 'y-websocket/src/y-websocket.js';


@Injectable({
  providedIn: 'root'
})
export class YjsServerService {

  private doc1 = automerge.from({ text: 'Nothing'});

  private doc2 = automerge.from({ text: 'Nothing'});

  //try out the websocket next
  // can first try update listener and just log when one client makes a change
  // private wsProvider = new WebsocketProvider('ws://localhost:1234', 'my-roomname', this.doc);
  constructor() {
    // THIS WORKS!
    this.testAutomerge('hello', 'bye');


  }

  private testAutomerge(newText, blah) {
    this.doc1 = automerge.change(this.doc1, 'Changing text doc', doc => {
      doc.text = newText;
    });

    this.doc1 = automerge.change(this.doc1, 'Changing text doc', doc => {
      doc.text = newText;
    });

    this.doc1 = automerge.change(this.doc1, 'Changing text doc', doc => {
      doc.text = newText;
    });

    this.doc1 = automerge.change(this.doc1, 'Changing text doc', doc => {
      doc.text = newText;
    });

    this.doc1 = automerge.change(this.doc1, 'Changing text doc', doc => {
      doc.text = newText;
    });

    this.doc1 = automerge.change(this.doc1, 'Changing text doc', doc => {
      doc.text = newText;
    });

    const data1 = automerge.getChanges(automerge.init(), this.doc1);
    console.log(data1);
    // this.doc2 = automerge.applyChanges(automerge.init(), JSON.parse(data1));

    this.doc2 = automerge.applyChanges(automerge.init(), JSON.parse(JSON.stringify(data1)));

    console.log('TEST1', this.doc1.text, this.doc2.text);
    const node2update = automerge.change(this.doc2, 'Changing text doc', doc => {
      doc.text = blah;
    });

    const data2 = JSON.stringify(automerge.getChanges(this.doc2, node2update));

    const final = automerge.applyChanges(this.doc1, JSON.parse(data2));

    console.log('FINAL', final.text, node2update.text);
  }
}
