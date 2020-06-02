import { Injectable } from '@angular/core';
import { Spinner } from 'spin.js';

@Injectable()
export class SpinnerService {

  private spinner: Spinner;

  constructor() {}

  buildSpinnerStyle(config?) {
    let defaultConfig = {
      lines: 15, // The number of lines to draw
      length: 16, // The length of each line
      width: 8, // The line thickness
      radius: 25, // The radius of the inner circle
      scale: 0.6, // Scales overall size of the spinner
      corners: 1, // Corner roundness (0..1)
      color: '#2f7fd9', // CSS color or array of colors
      fadeColor: 'transparent', // CSS color or array of colors
      speed: 1.8, // Rounds per second
      rotate: 0, // The rotation offset
      animation: 'spinner-line-fade-quick', // The CSS animation name for the lines
      direction: 1, // 1: clockwise, -1: counterclockwise
      zIndex: 2e9, // The z-index (defaults to 2000000000)
      className: 'spinner', // The CSS class to assign to the spinner
      top: '50%', // Top position relative to parent
      left: '50%', // Left position relative to parent
      shadow: '0 0 1px transparent', // Box-shadow for the lines
      position: 'absolute' // Element positioning
    };

    Object.assign(defaultConfig, config);
    return defaultConfig;
  }

  private initSpiner(config?) {
    let opts = this.buildSpinnerStyle(config);
    this.spinner = new Spinner(opts);
  }

  showSpinner(elementId?, extraConfig?) {
    if (this.spinner) {
      this.spinner.stop();
    }
    
    this.initSpiner(extraConfig);
    let target = elementId ? document.getElementById(elementId) : document.getElementsByTagName('body')[0];
    this.spinner.spin(target);
  }

  hideSpinner() {
    this.spinner.stop();
  }
}
