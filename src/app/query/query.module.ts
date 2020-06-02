import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QueryRoutingModule } from './query-routing.module';
import { QueryListComponent } from './query-list/query-list.component';
import { QueryBuilderComponent } from './query-builder/query-builder.component';
import { SharedModule } from '../shared/shared.module';
import { QueryMessageService } from './query-message.service';
import { ContenteditableModule } from 'ng-contenteditable';

@NgModule({
  imports: [
    CommonModule,
    QueryRoutingModule,
    SharedModule,
    ContenteditableModule
  ],
  providers: [
    QueryMessageService
  ],
  entryComponents: [
    QueryBuilderComponent
  ],
  declarations: [QueryListComponent, QueryBuilderComponent]
})
export class QueryModule { }
