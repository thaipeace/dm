import {NgModule} from '@angular/core';
import {DeviceListComponent} from './device-list/device-list.component';
import {DeviceRoutingModule} from './devide-routing.module';
import {DeviceListService} from './device-list/device-list.service';
import {SharedModule} from '../shared/shared.module';
import {EditDeviceComponent} from './edit-device/edit-device.component';
import {DeviceDetailComponent} from './device-detail/device-detail.component';
import {DeviceDetailDetailsComponent} from './device-detail/device-detail-details/device-detail-details.component';
import {DeviceDetailSecurityComponent} from './device-detail/device-detail-security/device-detail-security.component';
import {CertificateService} from '../certificate/certificate.service';
import {DeviceProfilesComponent} from './device-profiles/device-profiles.component';
import { HeartbeatChartComponent } from './device-detail/heartbeat-chart/heartbeat-chart.component';
import { DeviceDetailTestComponent } from './device-detail/device-detail-test/device-detail-test.component';

@NgModule({
  imports: [
    DeviceRoutingModule,
    SharedModule
  ],
  declarations: [
    DeviceListComponent,
    EditDeviceComponent,
    DeviceDetailComponent,
    DeviceDetailDetailsComponent,
    DeviceDetailSecurityComponent,
    DeviceProfilesComponent,
    HeartbeatChartComponent,
    DeviceDetailTestComponent
  ],
  entryComponents: [
    EditDeviceComponent
  ],
  providers: [
    DeviceListService,
    CertificateService
  ]
})
export class DeviceModule {
}
