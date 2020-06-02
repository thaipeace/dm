import { Component, OnInit, Input, Output } from '@angular/core';
import { ModalService } from '../../shared/services/modal.service';
import { GeneralConstant } from '../../shared/constants/general.constant';
import { Payload } from 'src/app/shared/models/payload';
import { PayloadsConstant } from 'src/app/shared/constants/payloads.constant';
import { ApiDataService } from 'src/app/shared/services/api-data.service';
import { DataUtilService } from 'src/app/shared/services/data-util.service';

@Component({
  selector: 'app-query-builder',
  templateUrl: './query-builder.component.html',
  styleUrls: ['./query-builder.component.scss']
})
export class QueryBuilderComponent implements OnInit {

  @Input() dataModal: any;

  public title: string;
  public query: any = {
    name: '',
    edge: null,
    app: null,
    time: '',
    operation: ''
  };
  public edges: any[];
  public apps: any[];

  constructor(
    private modalService: ModalService,
    private apiDataService: ApiDataService,
    private dataUtilService: DataUtilService
  ) {  }

  ngOnInit() {
    this.apps = [];
    this.edges = this.dataModal;
  }

  public onSaveQuery() {
    this.modalService.emitAndDestroy(
      this.query,
      GeneralConstant.modalDataReturnType.queryBuilder
    );
  }

  public close() {
    this.modalService.destroy();
  }

  public async onSelectEdge() {
    this.query.app = null;
    let res = await this.setAppsByEdge(this.query.edge);
    let rawResponse = this.dataUtilService.convertXmlToJson(`<result>${res}</result>`);
    if (rawResponse.result.Status === 'Success') {
      let applications = this.dataUtilService.wrapObjToOneElementArray(rawResponse.result.Applications.Application);
      this.apps = applications.filter(app => {
        return app.State === 'Deployed' && app.IsTargetSchemaApplication !== "true" && app.AppId;
      });
    } else {
      this.apps = [];
    }
  }

  private setAppsByEdge(edge) {
    let findAppsByAStackIdPayload = new Payload(PayloadsConstant.application.findAppsByAStackId, [edge.EdgeId]);
    return this.apiDataService.executeQueryByServer(findAppsByAStackIdPayload, 'application').toPromise();
  }
}
