import { Component, OnInit, Input, Output } from '@angular/core';
import { ModalService } from '../../shared/services/modal.service';
import { GeneralConstant } from '../../shared/constants/general.constant';

@Component({
  selector: 'app-edit-device',
  templateUrl: './edit-device.component.html',
  styleUrls: ['./edit-device.component.scss']
})
export class EditDeviceComponent implements OnInit {
  // Catch name from the inputs.selectedDevice in devide-list.component.ts
  @Input() dataModal: any;

  public title: string;
  public selectedDevice: any;

  constructor(
    private modalService: ModalService
  ) {  }

  ngOnInit() {
    this.selectedDevice = this.dataModal;
  }

  public onSaveDevice() {
    let type: string;
    type = this.selectedDevice.id ?
      GeneralConstant.modalDataReturnType.editDevice :
      GeneralConstant.modalDataReturnType.createDevice;

    this.modalService.emitAndDestroy(this.selectedDevice, type);
  }

  public close() {
    this.modalService.destroy();
  }
}