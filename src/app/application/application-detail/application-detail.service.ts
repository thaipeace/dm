import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { Payload } from 'src/app/shared/models/payload';
import { PayloadsConstant } from 'src/app/shared/constants/payloads.constant';
import { ApiDataService } from 'src/app/shared/services/api-data.service';

@Injectable({
  providedIn: 'root'
})
export class ApplicationDetailService {

  constructor(
    private apiDataService: ApiDataService
  ) { }

  undeployMultipleThings(things, app): Observable<any[]> {
    return forkJoin(
      things.map(thing => {
        let undeployModelPayload = new Payload(
          PayloadsConstant.edge.unDeployApplicationFromEdge,
          [thing.AStackId.Value, app.AppId]
        );
        return this.apiDataService.executeQueryByServer(undeployModelPayload, 'edge')
      })
    );
  }
}
