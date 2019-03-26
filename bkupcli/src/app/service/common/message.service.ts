import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  messages: string[] = [];
  errMessage: string = '';

  add(message: string) {
    this.messages.push(message)
  }

  addErrMessage(message: string) {
    this.errMessage = message;
  }
  clear() {
    this.messages = [];
  }
  clearErrorMessage() {
    this.errMessage = '';
  }
  constructor() { }
}
