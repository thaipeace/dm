import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {debounceTime} from 'rxjs/operators';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NotificationComponent implements OnInit {

  successMessage: string;
  notiType: string;

  constructor(
    private notificationService: NotificationService
  ) {
  }

  ngOnInit(): void {
    this.notificationService.notification.subscribe(notification => {
      this.successMessage = notification.message;
      this.notiType = notification.type;
    });

    this.notificationService.notification.pipe(debounceTime(7000)).subscribe(
      () => this.successMessage = null
    );
  }
}
