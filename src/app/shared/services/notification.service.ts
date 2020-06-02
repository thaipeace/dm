import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class NotificationService {

  public notification = new EventEmitter();

  constructor() { }

  addNotification(message, type) {
    this.notification.emit({
      message: message,
      type: type
    });
  }
}
