import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { DeviceMessageService } from '../../../shared/services/device-message.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-heartbeat-chart',
  templateUrl: './heartbeat-chart.component.html',
  styleUrls: ['./heartbeat-chart.component.scss']
})
export class HeartbeatChartComponent implements OnInit, OnDestroy {

  @Input() device: any;
  private heartPoints: any[];
  private isDeviceLive: boolean;
  private addData: any;
  public subscription: Subscription

  public chart = new Chart({
    chart: {
      type: 'line'
    },
    title: {
      text: 'Device Heartbeat'
    },
    credits: {
      enabled: false
    },
    series: [
      {
        name: 'Beat line',
        data: [1, 2, 3]
      }
    ]
  });
 
  constructor(
    private deviceMessageService: DeviceMessageService
  ) {
    this.heartPoints = [0,0,2,-2,1,0,8,-8,3,-1,0,0];
  }

  ngOnInit() {
    this.addData = setInterval(
      ()=> {
        for (let i=0; i<this.heartPoints.length; i++) {
          this.add(i);
        }
      }, 5000
    );

    this.subscription = this.deviceMessageService.messageReadingObservable.subscribe((rs) => {
      if (rs) {
        
      }
    })
  }

  ngOnDestroy() {
    if(this.addData) {
      clearInterval(this.addData);
    }
    this.subscription.unsubscribe();
  }

  add(pointIndex) {
    this.chart.addPoint(this.isDeviceLive ? this.heartPoints[pointIndex] : 0);
  }
}
