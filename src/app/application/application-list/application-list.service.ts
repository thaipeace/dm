import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { PayloadsConstant } from 'src/app/shared/constants/payloads.constant';
import { Payload } from 'src/app/shared/models/payload';
import { ApiDataService } from 'src/app/shared/services/api-data.service';
import { DataUtilService } from 'src/app/shared/services/data-util.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class ApplicationListService {

  constructor(
    private apiDataService: ApiDataService,
    private dataUtilService: DataUtilService,
    private notificationService: NotificationService
  ) { }

  formatApplication(raw): any {
    let application = {};
    for (let key in raw) {
      application[key] = raw[key].$ ? raw[key].$.Value : raw[key];
    }

    return application;
  }

  updateApplications(applications, application): any {
    applications.forEach(item => {
      if (item.application.AppId !== application.applicationId) return;
      item.application = application;
    });

    return applications;
  }

  getApplicationsByLimitCount(originalApplicationList: any[], limit: number): any[] {
    let applications =  originalApplicationList.filter((application, index) => index < limit);
    return applications;
  }

  deleteMultipleApp(datas): Observable<any[]> {
    return forkJoin(
      datas.map(data => {
        let removeApplicationPayload = new Payload(PayloadsConstant.application.remove, [data.AppId])
        return this.apiDataService.executeQueryByServer(removeApplicationPayload, 'application')
      })
    );
  }

  async undeployMultipleAppFromEgdes(apps) {
    let queryExes = [];
    for (let app of apps) {
      if (app.Deployment === '0') {
        queryExes.push({error: `UnDeployment Failed. Application ${app.Name.$.Value} is never Deployed`})
      } else {
        let resEdges = await this.getEdgesDeployByAppId(app);
        let edgesRaw = this.dataUtilService.convertXmlToJsonParseAttributes(
          `<result>${resEdges}</result>`
        );

        let edges = this.dataUtilService.wrapObjToOneElementArray(edgesRaw.result.AStackList.AStackDetail);
        edges = edges.filter(edge => edge.DeployedApp.State.Value === 'Deployed');

        edges.forEach(edge => {
          let undeployPayload = new Payload(
            PayloadsConstant.edge.unDeployApplicationFromEdge,
            [edge.AStackId.Value, app.AppId]
          )
          queryExes.push({appName: app.Name.$.Value, payload: undeployPayload.buildPayload()});
        });
      }
    };

    return Promise.resolve(queryExes);
  }

  private getEdgesDeployByAppId(app) {
    let getThingByAppIdPayload = new Payload(PayloadsConstant.application.findAStacksByApp, [app.Name.$.Value, app.Version.$.Value]);
    return this.apiDataService.executeQueryByServer(getThingByAppIdPayload, 'application').toPromise();
  }
}
