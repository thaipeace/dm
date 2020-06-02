import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payload } from '../models/payload';
import { AppConfigService } from '../../app-config.service';

@Injectable({
  providedIn: 'root'
})
export class ApiDataService {

  constructor(
    private httpClient: HttpClient,
    private appConfigService: AppConfigService
  ) { }

  executeQueryLogin(payload: Payload): Observable<string> {
    let url = `http://${this.appConfigService.settings.url}:${this.appConfigService.settings.port}/${this.appConfigService.settings.api.loginSuffix}`;
    return this.httpClient.post(url, payload.buildPayload(),
      {
        headers: new HttpHeaders({'Content-Type': 'text/xml'}),
        responseType: 'text'
      }
    );
  }

  executeQuery(payload: Payload): Observable<string> {
    let url = `http://${this.appConfigService.settings.url}:${this.appConfigService.settings.port}/${this.appConfigService.settings.api.suffix}`;
    return this.httpClient.post(url, payload.buildPayload(),
      {
        headers: new HttpHeaders({'Content-Type': 'text/xml'}),
        responseType: 'text'
      }
    );
  }

  executeQueryByServer(payload: Payload, server?: string): Observable<string> {
    let url = this.appConfigService.settings[server].url ? this.appConfigService.settings[server].url : this.appConfigService.settings.url;
    let port = this.appConfigService.settings[server].port ? this.appConfigService.settings[server].port : this.appConfigService.settings.port;

    let fullUrl = `http://${url}:${port}/${this.appConfigService.settings[server].api.suffix}`;
    return this.httpClient.post(fullUrl, payload.buildPayload(),
      {
        headers: new HttpHeaders({'Content-Type': 'text/xml'}),
        responseType: 'text'
      }
    );
  }

  executeRawQueryByServer(rawPayload: string, server?: string): Observable<string> {
    let url = this.appConfigService.settings[server].url ? this.appConfigService.settings[server].url : this.appConfigService.settings.url;
    let port = this.appConfigService.settings[server].port ? this.appConfigService.settings[server].port : this.appConfigService.settings.port;

    let fullUrl = `http://${url}:${port}/${this.appConfigService.settings[server].api.suffix}`;
    return this.httpClient.post(fullUrl, rawPayload,
      {
        headers: new HttpHeaders({'Content-Type': 'text/xml'}),
        responseType: 'text'
      }
    );
  }
}
