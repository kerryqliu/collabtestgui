import { Injectable } from '@angular/core';
import * as automerge from 'automerge';
import { webSocket } from 'rxjs/webSocket';

export interface Command {
  execute(): void;
}



@Injectable({
  providedIn: 'root'
})
export class ButtonAutomergeService {

  private displayedText = 'Nothing';

  private doc1 = automerge.from({ cards: [] });
  private doc2 = automerge.init();
  private finalDoc = automerge.init();

  private socket = webSocket({
    url: 'ws://localhost:8080/automerge',
  });

  private testDoc = automerge.from({ text: 'Nothing'});

  constructor() {
    const self = this;

  //  this.testAutoMerge();

    this.socket.subscribe({
      next(response) {
        console.log(response);
        if (response.hasOwnProperty('response')) {
          console.log(response.response);
          self.changeText(response.response);
        }
      },
      error(err) {
        console.log('problem');
        console.log(JSON.stringify(err));
        throw new Error(err);
      },
      complete() {
        console.log('websocket finished and disconnected');
      }
    });
   }

  public testAutoMerge() {
    this.doc1 = automerge.change(this.doc1, 'Add card', doc => {
      doc.cards.push({ title: 'Rewrite everything in Clojure', done: false });
    });

    this.doc1 = automerge.change(this.doc1, 'Add another card', doc => {
      doc.cards.insertAt(0, { title: 'Rewrite everything in Haskell', done: false });
    });

    this.doc2 = automerge.merge(this.doc2, this.doc1);

    if (this.doc1.hasOwnProperty('cards') && this.doc2.hasOwnProperty('cards')) {
      console.log(this.doc1.cards);
      console.log(this.doc1.cards[0]);

      console.log('DOC 2');
      console.log(this.doc2['cards']);
    }

    this.doc1 = automerge.change(this.doc1, 'Mark card as done', doc => {
      doc.cards[0].done = true;
    });

    this.doc2 = automerge.change(this.doc2, 'Delete card', doc => {
      if (doc.hasOwnProperty('cards')) {
        doc['cards'][0].done = false;
      }
    });

    this.finalDoc = automerge.merge(this.doc1, this.doc2);


    // FIgure out how this conflicts works
    // console.log('CONFLICTS', automerge.getConflicts(this.doc2, 'cards'));


    console.log(this.finalDoc['cards']);
    // console.log('save', automerge.save(this.finalDoc));
    console.log(automerge.getHistory(this.finalDoc).map(state => [state.change.message, state.snapshot['cards'].length]));
  }

  public executeCommand(newText) {
    const command: Command = {
      execute: () => this.sendText(newText)
    };
    command.execute();
  }

  private sendText(newText) {
    const newDoc = automerge.change(this.testDoc, 'Changing text doc', doc => {
      doc.text = newText;
    });

    const serialized = automerge.save(newDoc);
    this.socket.next(serialized);
  }

  public changeText(newObject) {
    // automerge
    this.testDoc = automerge.load(newObject);

  //  this.sendText(newText);
  }

  public getText() {
    return this.testDoc.text;
  }
}
