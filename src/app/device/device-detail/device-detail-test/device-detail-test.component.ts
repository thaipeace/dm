import { Component, OnInit, Input } from '@angular/core';
import { Payload } from 'src/app/shared/models/payload';
import { PayloadsConstant } from 'src/app/shared/constants/payloads.constant';
import { ApiDataService } from 'src/app/shared/services/api-data.service';
import { DataUtilService } from 'src/app/shared/services/data-util.service';

@Component({
  selector: 'app-device-detail-test',
  templateUrl: './device-detail-test.component.html',
  styleUrls: ['./device-detail-test.component.scss']
})
export class DeviceDetailTestComponent implements OnInit {

  @Input() device: any;
  public deviceTest: any;
  public deviceTestList: any[];

  constructor(
    private apiDataService: ApiDataService,
    private dataUtilService: DataUtilService
  ) { }

  ngOnInit() {
    this.setDeviceTest();
  }

  setDeviceTest() {
    let deviceTestDevice = new Payload(PayloadsConstant.deviceTest, []);
    this.apiDataService.executeQuery(deviceTestDevice).subscribe(res => {
      let raw = this.dataUtilService.convertXmlToJson(res);
      if (raw.Find.$.Status === 'Success') {
        this.deviceTestList = this.dataUtilService.wrapObjToOneElementArray(raw.Find.Result);
        this.deviceTest = this.deviceTestList.find(device => {
          return device.DeviceTest.DeviceId.$.Value === this.device.DeviceId
        });
      }
    }, error => {
      console.log('Loading error');
    })
  }

}
