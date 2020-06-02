import {Injectable} from '@angular/core';
import {$WebSocket} from 'angular2-websocket/angular2-websocket';
import {DataUtilService} from "./data-util.service";

@Injectable()
export class WebsocketService {
  private wsList = [];

  constructor(
    private dataUtilService: DataUtilService
  ){}

  startWS(label, url, payload, callback = (rs) => {}) {
    console.log(`======START WS startWS: ${label}======`);

    if (this.wsList[label]) {
      this.wsList[label].close(true);
    }

    let ws = new $WebSocket(url);
    this.wsList[label] = ws;

    // set received message stream
    ws.getDataStream().subscribe((msg) => {
      try {
        callback(this.dataUtilService.convertXmlToJsonParseAttributes(msg.data));
      } catch (e) {
        console.error(e);
      }
    }, (msg) => {
      console.error('error', msg);
    }, () => {
      console.log('complete');
    });

    ws.send(payload).subscribe();
  }

}
