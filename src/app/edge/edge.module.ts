import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EdgeRoutingModule } from './edge-routing.module';
import { EdgeListComponent } from './edge-list/edge-list.component';
import { EditEdgeComponent } from './edit-edge/edit-edge.component';
import { EdgeDetailComponent } from './edge-detail/edge-detail.component';
import { EdgeListService } from './edge-list/edge-list.service';
import { SharedModule } from '../shared/shared.module';
import { EdgeListMapComponent } from './edge-list/edge-list-map/edge-list-map.component';
import { AgmCoreModule } from '@agm/core';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { EdgeSummaryComponent } from './edge-list/edge-summary/edge-summary.component';

@NgModule({
  imports: [
    CommonModule,
    EdgeRoutingModule,
    SharedModule,
    AgmCoreModule.forRoot({ apiKey: 'AIzaSyDpEj9HxyEcxum6NTmoBCM0CWEpr_c_-ug' }),
    AgmSnazzyInfoWindowModule
  ],
  declarations: [
    EdgeListComponent,
    EditEdgeComponent,
    EdgeDetailComponent,
    EdgeListMapComponent,
    EdgeSummaryComponent
  ],
  entryComponents: [
    EditEdgeComponent
  ],
  providers: [
    EdgeListService
  ]
})
export class EdgeModule { }
