import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { PayloadsConstant } from '../../constants/payloads.constant';
import { Payload } from '../../models/payload';
import { ApiDataService } from '../../services/api-data.service';

@Injectable({
  providedIn: 'root'
})
export class ApplicationDeploymentService {

  constructor(
    private apiDataService: ApiDataService
  ) { }

  startMultipleApp(datas): Observable<any[]> {
    return forkJoin(
      datas.map(data => {
        let startModelMappingPayload = new Payload(PayloadsConstant.application.start, []);
        return this.apiDataService.executeQuery(startModelMappingPayload)
      })
    );
  }

  stopMultipleApp(datas): Observable<any[]> {
    return forkJoin(
      datas.map(data => {
        let stopModelMappingPayload = new Payload(PayloadsConstant.application.stop, []);
        return this.apiDataService.executeQuery(stopModelMappingPayload)
      })
    );
  }

  restartMultipleApp(datas): Observable<any[]> {
    return forkJoin(
      datas.map(data => {
        let syncModelPayload = new Payload(PayloadsConstant.application.restart, []);
        return this.apiDataService.executeQuery(syncModelPayload)
      })
    );
  }

  redeployMultipleApp(datas): Observable<any[]> {
    return forkJoin(
      datas.map(data => {
        let syncModelPayload = new Payload(PayloadsConstant.application.redeploy, []);
        return this.apiDataService.executeQuery(syncModelPayload)
      })
    );
  }

  undeployMultipleApp(thing, datas): Observable<any[]> {
    return forkJoin(
      datas.map(data => {
        let undeployModelPayload = new Payload(
          PayloadsConstant.edge.unDeployApplicationFromEdge,
          [thing.EdgeId, data.AppId]
        );
        return this.apiDataService.executeQueryByServer(undeployModelPayload, 'edge')
      })
    );
  }
}
