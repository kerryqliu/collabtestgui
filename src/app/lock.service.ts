import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LockService {
  // update this to use a socket

  private lock = false;

  constructor() { }

  public toggleLock() {
    this.lock = !this.lock;
  }

  public getLock() {
    return this.lock;
  }
}
