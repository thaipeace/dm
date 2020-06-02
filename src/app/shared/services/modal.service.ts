import { Injectable, EventEmitter } from '@angular/core';
import { DomService } from './dom.service';

@Injectable()
export class ModalService {

  constructor(private domService: DomService) { }

  private modalElementId = 'modal-container';
  private overlayElementId = 'overlay';
  public result: EventEmitter<any> = new EventEmitter();

  private init(component: any, inputs: object, outputs: object) {
    let componentConfig = {
      inputs:inputs,
      outputs:outputs
    }
    this.domService.appendComponentTo(this.modalElementId, component, componentConfig);
    document.getElementById(this.modalElementId).className = 'show';
    document.getElementById(this.overlayElementId).className = 'show';
  }

  emitOutput(data: any, type: string) {
    if (!data && !type) return;
    this.result.emit({data: data, formType: type});
  }

  destroy() {
    this.domService.removeComponent();
    document.getElementById(this.modalElementId).className = 'hidden';
    document.getElementById(this.overlayElementId).className = 'hidden';
  }

  emitAndDestroy(data: any, type: string) {
    if (!data && !type) return;
    this.result.emit({data: data, formType: type});
    this.destroy();
  }

  openDataModal(component, data, title) {
    let inputs = {
      title: title,
      dataModal: data
    }

    this.init(component, inputs, {});
  }
}