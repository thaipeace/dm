import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { PayloadsConstant } from '../shared/constants/payloads.constant';
import { WebsocketService } from '../shared/services/websocket.service';
import { AppConfigService } from '../app-config.service';
import { NotificationService } from '../shared/services/notification.service';

@Injectable()
export class QueryMessageService {

  private messageReadingSource = new BehaviorSubject(null);
  public messageReadingObservable = this.messageReadingSource.asObservable();

  constructor(
    private wsService: WebsocketService,
    private appConfigService: AppConfigService,
    private notificationService: NotificationService
  ) {
    let url = `ws://${this.appConfigService.settings.edge.url}:${this.appConfigService.settings.edge.port}/${this.appConfigService.settings.edge.query.ws.suffix}`;
    let payload = PayloadsConstant.websocket.edge.query;
    this.wsService.startWS('edgeQuery', url, payload, (rs) => {
      if (!rs) this.messageReadingSource.next('Error: Query did not run successfully');
      if (rs.TqlNotification
        && rs.TqlNotification.Update
        && rs.TqlNotification.Update.Model) {
        try {
          let acceptKey = 'Atomiton.Sensors.MqttSubscriberModel.ReceivedData';
          if (rs.TqlNotification.Update.Model[acceptKey]) {
            this.messageReadingSource.next(
              rs.TqlNotification.Update.Model[acceptKey].Known.Message.EdgeQueryResponse.Response
            );
            this.notificationService.addNotification('Query run successfully', 'success');
          } else {
            this.messageReadingSource.next('Error: Query did not return right data');
          }
          
        } catch (e) {
          console.error(e);
        }
      } else {
        this.messageReadingSource.next('Error: Query did not return right data');
      }
    });
  }
}