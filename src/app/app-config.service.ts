import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {

  public settings: any;

  constructor() { }

  loadJSON() {
    const json = this.loadTextFileAjaxSync(`assets/config/config.json`, "application/json");
    this.settings = JSON.parse(json);

    if (!window.location.hostname.includes("local")) {
      this.settings.url = window.location.hostname;
      this.settings.port = window.location.port;
    } else {
      this.settings.url = this.settings.api.url || '18.221.199.94'; //18.221.199.94:9090, 13.233.64.170:9090, eesdev.atomiton.com:9090
      this.settings.port = this.settings.api.port || '9090';
    }
  }

  loadTextFileAjaxSync(filePath, mimeType) {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", filePath, false);
    if (mimeType != null) {
      if (xmlhttp.overrideMimeType) {
        xmlhttp.overrideMimeType(mimeType);
      }
    }
    xmlhttp.send();
    if (xmlhttp.status == 200) {
      return xmlhttp.responseText;
    }
    else {
      return null;
    }
  }
}
