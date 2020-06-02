import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { filter } from 'rxjs/operators'
import { Payload } from "../../shared/models/payload";
import { PayloadsConstant } from "../../shared/constants/payloads.constant";
import { ApiDataService } from "../../shared/services/api-data.service";
import { DataUtilService } from "../../shared/services/data-util.service";
import { DetailService } from "../../shared/services/detail.service";

@Component({
  selector: "app-breadcrumb",
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})

export class BreadcrumbComponent implements OnInit {

  public breadcrumbs = [];
  private deviceId: string;
  private certificateId: string;
  private edgeId: string;
  private applicationId: string;
  private ruleId: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private apiDataService: ApiDataService,
    private dataUtilService: DataUtilService,
    private detailService: DetailService
  ) {
  }

  ngOnInit() {
    this.router.events.pipe(filter((event: Event) => event instanceof NavigationEnd))
      .subscribe(event => {
        let activatedRoutesnapshot = this.activatedRoute.children[0].snapshot;
        if (!activatedRoutesnapshot.data.breadcrumb) return;

        this.deviceId = activatedRoutesnapshot.params.deviceId;
        this.certificateId = activatedRoutesnapshot.params.certificateId;
        this.edgeId = activatedRoutesnapshot.params.edgeId;
        this.applicationId = activatedRoutesnapshot.params.applicationId;
        this.ruleId = activatedRoutesnapshot.params.ruleId;
        this.handleBreadcrumb(JSON.parse(JSON.stringify(activatedRoutesnapshot.data.breadcrumb)));
      }
    );
  }

  async handleBreadcrumb(breadcrumbs): Promise<any> {
    for (let i=0; i < breadcrumbs.length; i++) {
      let breadcrumb = breadcrumbs[i];
      if (breadcrumb.label.includes(':')) {
        let respose = await this.getTitle(breadcrumb.label.replace(':', ''));
        let rawValue = this.dataUtilService.convertXmlToJson(respose);

        switch(breadcrumb.label.replace(':', '')) {
          case 'deviceId':
            if (!rawValue.Find.Result) return;
            breadcrumb.label = rawValue.Find.Result.Device.DeviceName;
            break;

          case 'certificateId':
            if (!rawValue.Find.Result) return;
            breadcrumb.label = rawValue.Find.Result.DeviceCertificate.commonName;
            break;

          case 'edgeId':
            if (!rawValue.Find.Result) return;
            breadcrumb.label = rawValue.Find.Result.Edge.DisplayName;
            break;
            
          case 'applicationId':
            if (!rawValue.Find.Result) return;
            breadcrumb.label = rawValue.Find.Result.Application.Name.$.Value;
            break;

          case 'ruleId':
            if (!rawValue) return;
            breadcrumb.label = rawValue.Response.$.Status === 'Success' ?
              rawValue.Response.Result.Rule.RuleName :
              'Creating new Rule'
            break;
            
          default:
            break;
        }
      }
    }

    this.breadcrumbs = breadcrumbs;
  }

  async getTitle(label): Promise<any> {
    let payload: Payload;
    switch(label) {
      case 'deviceId':
        payload = new Payload(PayloadsConstant.findDevicesByDeviceId, [this.deviceId]);
        return this.apiDataService.executeQuery(payload).toPromise();

      case 'certificateId':
        payload = new Payload(PayloadsConstant.findCertificateByCertificateId, [this.certificateId]);
        return this.apiDataService.executeQuery(payload).toPromise();

      case 'edgeId':
        payload = new Payload(PayloadsConstant.edge.getById, [this.edgeId]);
        return this.apiDataService.executeQueryByServer(payload, 'edge').toPromise();

      case 'applicationId':
        payload = new Payload(PayloadsConstant.application.getById, [this.applicationId]);
        return this.apiDataService.executeQueryByServer(payload, 'application').toPromise();

      case 'ruleId':
        return this.detailService.getItemByTargetValue(
          PayloadsConstant.data.fetchRuleByTarget, 'RuleId', this.ruleId, 'data'
        );
        
      default:
        break;
    }
  }
}