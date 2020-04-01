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

    // I want to release lock when session closes and also after a certain amount of time.
  //  this.testAutoMerge();

    this.socket.subscribe({
      next(response) {
        console.log('Receiving text');
        if (response.hasOwnProperty('response')) {
        //  console.log(response['response']);
          self.changeText(response['response']);
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

  public executeCommand(newText) {
    const command: Command = {
      execute: () => this.sendText(newText)
    };
    command.execute();
  }

  private sendText(newText) {
    this.testDoc = automerge.change(this.testDoc, 'Changing text doc', doc => {
      doc.text = newText;
    });

    console.log('sending text!');
    const serialized = automerge.save(this.testDoc);
    this.socket.next(serialized);
  }

  public changeText(newObject) {
    // automerge
    this.testDoc = automerge.load(newObject);

  //  this.sendText(newText);
  }

  public closeConnection() {
    this.socket.complete();
  }

  public getText() {
    return this.testDoc.text;
  }
}
