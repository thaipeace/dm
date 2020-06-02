import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DeviceListComponent} from './device-list/device-list.component';
import {DeviceDetailComponent} from './device-detail/device-detail.component';
import {DeviceProfilesComponent} from "./device-profiles/device-profiles.component";
import { AuthGuard } from '../guard/auth.guard';

const deviceRoutes: Routes = [
  { 
    path: 'devices', component: DeviceListComponent, data: { 
      breadcrumb: [
        {label: "Devices", url: ""}
      ]
    },
    canActivate: [AuthGuard]
  },
  { 
    path: 'devices/device/:deviceId', component: DeviceDetailComponent, data: {
      breadcrumb: [
        { label: "Devices", url: "/devices" },
        { label: ":deviceId", url: "" }
      ]
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'devices/profiles', component: DeviceProfilesComponent, data: { 
      breadcrumb: [
        { label: "Profiles", url: "" }
      ]
    },
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(deviceRoutes)],
  exports: [RouterModule]
})
export class DeviceRoutingModule {
}
