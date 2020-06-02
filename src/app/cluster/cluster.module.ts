import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ClusterListComponent} from "./cluster-list/cluster-list.component";
import {ClusterAlertComponent} from "./cluster-alert/cluster-alert.component";
import {ClusterAlarmComponent} from "./cluster-alarm/cluster-alarm.component";
import {ClusterRoutingModule} from "./cluster-routing.module";

@NgModule({
  imports: [
    CommonModule,
    ClusterRoutingModule
  ],
  declarations: [
    ClusterListComponent,
    ClusterAlarmComponent,
    ClusterAlertComponent
  ]
})
export class ClusterModule {
}
