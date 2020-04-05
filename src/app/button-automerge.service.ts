import { Injectable } from '@angular/core';
import * as automerge from 'automerge';
import { webSocket } from 'rxjs/webSocket';
import { getLocaleDirection } from '@angular/common';

export interface Command {
  execute(): void;
}



@Injectable({
  providedIn: 'root'
})
export class ButtonAutomergeService {

  private lock = false;
  private test = [];
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
        console.log("Message received!");
        if (response.hasOwnProperty('response')) { // Receive change from another server
        //  console.log(response['response']);
          self.changeText(response['response']);
        } else if (response.hasOwnProperty('lockStatus')) { // Response from lock request
          // console.log(response);
          self.setLock(response['lockStatus']);
        } else if (response.hasOwnProperty('initial')) { // Checks if initial state is already set
          if (response['initial'] === false) {
            self.initializeAndSend('Nothing');
          }
        } else if (response.hasOwnProperty('initialization')) { // If there's an initialization, we load it
          self.initializeFromServer(response['initialization']);
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
    const newDoc = automerge.change(this.testDoc, 'Changing text doc', doc => {
      doc.text = newText;
    });

    console.log('sending text!');
    const changes = automerge.getChanges(this.testDoc, newDoc);
    console.log(changes);
    this.testDoc = automerge.applyChanges(this.testDoc, changes);
    this.socket.next(JSON.stringify(changes));
    const initDiff = automerge.getChanges(automerge.init(), this.testDoc);
    console.log(initDiff);
    this.socket.next('changeInitial' + JSON.stringify(initDiff));
  }

  public changeText(newObject) {
    // automerge
    const changes = JSON.parse(newObject);
    console.log(changes);
    this.testDoc = automerge.applyChanges(this.testDoc, changes);
  //  this.sendText(newText);
  }


  public getText() {
    return this.testDoc.text;
  }

  // Two functions to deal with initialization.
  public initializeAndSend(newText) {
    this.testDoc = automerge.change(this.testDoc, 'Changing text doc', doc => {
      doc.text = newText;
    });

    const changes = JSON.stringify(automerge.getChanges(automerge.init(), this.testDoc));
    this.socket.next('changeInitial' + changes);
  }

  public initializeFromServer(newDoc) {
    this.testDoc = automerge.applyChanges(automerge.init(), JSON.parse(newDoc));
  }

  // For lock purposes
  public toggleLock() {
    this.socket.next('lockRequest');
  }

  public setLock(lock) {
    this.lock = lock;
  }

  public getLock() {
    return this.lock;
  }

  public closeConnection() {
    this.socket.complete();
  }

  public getAllConflicts(doc) {
    const conflicts = {};
    for (const key of Object.keys(doc)) {
      conflicts[key] = automerge.getConflicts(doc, key);
    }
    return conflicts;
  }
}
