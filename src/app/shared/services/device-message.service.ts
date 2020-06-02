import {Injectable} from '@angular/core';
import {WebsocketService} from './websocket.service';
import {BehaviorSubject} from "rxjs";
import {AppConfigService} from '../../app-config.service';
import {PayloadsConstant} from '../constants/payloads.constant';

@Injectable()
export class DeviceMessageService {

  private messageReadingSource = new BehaviorSubject(null);
  public messageReadingObservable = this.messageReadingSource.asObservable();

  constructor(
    private wsService: WebsocketService,
    private appConfigService: AppConfigService
  ) {
    let url = `ws://${this.appConfigService.settings.url}:${this.appConfigService.settings.port}/${this.appConfigService.settings.ws.suffix}`;
    let payload = PayloadsConstant.websocket.device;
    this.wsService.startWS('device', url, payload, (rs) => {
      try {
        if (rs.TqlNotification
          && rs.TqlNotification.Update
          && rs.TqlNotification.Update.Model['Atomiton.Sensors.MqttSubscriberModel.ReceivedData']) {
          let obj = rs.TqlNotification.Update.Model['Atomiton.Sensors.MqttSubscriberModel.ReceivedData'];
          if (obj.sid) {
            this.messageReadingSource.next(obj.sid);
          }
        }
      } catch (e) {
        console.error(e);
      }
    });
  }
}

