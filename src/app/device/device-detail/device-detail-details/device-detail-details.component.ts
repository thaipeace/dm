import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DataUtilService } from '../../../shared/services/data-util.service';

@Component({
  selector: 'app-device-detail-details',
  templateUrl: './device-detail-details.component.html',
  styleUrls: ['./device-detail-details.component.scss']
})
export class DeviceDetailDetailsComponent implements OnInit {

  @Input() device: any;
  @Output() reloadDevice = new EventEmitter();
  public deviceFilteredKeys: any[];
  public viewMore: boolean;

  constructor(
    public dataUtilService: DataUtilService
  ) { }

  ngOnInit() {
    this.reloadDevice.emit(this.device.DeviceId);
    this.deviceFilteredKeys = Object.keys(this.device).filter(key => !['DeviceName', 'Type', 'LastSeen', 'CurrentState'].includes(key));
    this.viewMore = false;
  }

}
