import { Component, OnInit, Input } from '@angular/core';
import { DataUtilService } from '../../shared/services/data-util.service';
import { ModalService } from '../../shared/services/modal.service';
import { GeneralConstant } from '../../shared/constants/general.constant';
import { Payload } from '../../shared/models/payload';
import { PayloadsConstant } from '../../shared/constants/payloads.constant';
import { ApiDataService } from '../../shared/services/api-data.service';

@Component({
  selector: 'app-attach-device-to-certificate',
  templateUrl: './attach-device-to-certificate.component.html',
  styleUrls: ['./attach-device-to-certificate.component.scss']
})
export class AttachDeviceToCertificateComponent implements OnInit {

  @Input() dataModal: any;
  public title: string;
  public searchText: string;
  public certificateName: string;
  public certificateId: string;
  public devices: any;
  public selectedDeviceMACAddress: string;
  public fieldsValuePairs: any = [
    { 
      fields: [
        {name: 'item.Device.DeviceName', type: 'string'},
        {name: 'item.Device.certId', type: 'string'}
      ],
      require: false
    }
  ];

  constructor(
    private dataUtilService: DataUtilService,
    private modalService: ModalService,
    private apiDataService: ApiDataService
  ) { }

  ngOnInit() {
    this.certificateName = this.dataModal.commonName;
    this.certificateId = this.dataModal.certId;
    this.getAllDevice();
  }

  getAllDevice() {
    let getAllDevicePayload = new Payload(PayloadsConstant.findAllDevices, []);
    this.apiDataService.executeQuery(getAllDevicePayload).subscribe(
      (response: any) => {
        this.devices = this.dataUtilService.wrapObjToOneElementArray(
          this.dataUtilService.convertXmlToJson(response).Find.Result
        );
      }, (error: any) => {
        console.log('Loading error');
      }
    );
  }

  onCancel() {
    this.modalService.destroy();
  }

  onAttach() {
    let type: string = GeneralConstant.modalDataReturnType.attachDevice;
    this.modalService.emitAndDestroy({ certificateId: this.certificateId, selectedDeviceMACAddress: this.selectedDeviceMACAddress }, type);
  }
}
