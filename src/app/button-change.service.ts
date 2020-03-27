import { Injectable } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { Subject } from 'rxjs';
import * as sharedb from 'sharedb';
import ReconnectingWebSocket from 'reconnecting-websocket';
import * as automerge from 'automerge';

export interface Command {
  execute(): void;
}

@Injectable({
  providedIn: 'root'
})


/** DROPWIZARD CODE(COMMENTED OUT) */
// export class ButtonChangeService {

//   private displayedText = 'Nothing';

//   private socket = webSocket({
//     url: 'ws://localhost:8080/test'
//   });

//   private textChanger = new Subject<string>();

//   constructor() {
//     const self = this;
//     this.socket.subscribe({
//       // seems like this no longer refers to the class when we enter this observable.

//       next(response) {
//         const blah = 'test';
//         console.log(this.blah);
//         console.log(response, self.displayedText);
//         if (typeof(response) === 'object') {
//           if (response.hasOwnProperty('response')) {
//             // tslint:disable-next-line:no-string-literal
//             self.changeText(response['response']);
//           }
//         }
//       },
//       error(err) {
//         console.log('problem');
//         console.log(JSON.stringify(err));
//         throw new Error(err); },
//       complete() {console.log('websocket finished and disconected'); }
//     }
//     );
//   }

//   // Right now just executes a command, can modify later to send to websocket server
//   public executeCommand(newText) {
//     const command: Command = {
//       execute: () => this.sendText(newText)
//     };
//     command.execute();
//   }

//   public getTextChanger() {
//     return this.textChanger.asObservable();
//   }

//   private sendText(newText) {
//     this.socket.next(newText);
//   }

//   public changeText(newText) {
//     console.log(this.displayedText);
//     this.displayedText = newText;
//   }

//   public getText() {
//     return this.displayedText;
//   }
// }


/** TRYING SHAREDB AND RECONNECTING SOCKET (FOR NOW) */

export class ButtonChangeService {

  private displayedText = 'Nothing';

  private socket = webSocket({
    url: 'ws://localhost:8080/test'
  });


  private normalSocket = new WebSocket('ws://localhost:8080/test');

  //private sharedbConnection = new sharedb.Connection(this.normalSocket);

  constructor() {
    const self = this;

    this.normalSocket.addEventListener('message', (response) => {
      console.log(response.data);
      const message = JSON.parse(response.data);
      if (message.hasOwnProperty('response')) {
        console.log(message);
        // tslint:disable-next-line:no-string-literal
        self.changeText(message['response']);
      }
    });
  }

  // Right now just executes a command, can modify later to send to websocket server
  public executeCommand(newText) {
    const command: Command = {
      execute: () => this.sendText(newText)
    };
    command.execute();
  }


  private sendText(newText) {
    this.normalSocket.send(newText);
  }

  public changeText(newText) {
    this.displayedText = newText;
  }

  public getText() {
    return this.displayedText;
  }
}
