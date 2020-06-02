import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { QueryMessageService } from '../query-message.service';
import { NotificationService } from '../../shared/services/notification.service';
import { QueryBuilderComponent } from '../query-builder/query-builder.component';
import { GeneralConstant } from '../../shared/constants/general.constant';
import { ModalService } from '../../shared/services/modal.service';
import { PayloadsConstant } from '../../shared/constants/payloads.constant';
import { Payload } from '../../shared/models/payload';
import { SpinnerService } from '../../shared/services/spinner.service';
import { ApiDataService } from '../../shared/services/api-data.service';
import { DataUtilService } from '../../shared/services/data-util.service';

@Component({
  selector: 'app-query-list',
  templateUrl: './query-list.component.html',
  styleUrls: ['./query-list.component.scss']
})
export class QueryListComponent implements OnInit {

  private subscription: Subscription;
  private modalSub: Subscription;
  public queryBuilders: any[];
  public query: string;
  public result: any;
  public queryContainer: any;
  public queryEditorLineNumber: string;
  public edges: any[];
  public selectedQueryBuilder: any;

  constructor(
    private queryMessageService: QueryMessageService,
    private notificationService: NotificationService,
    private modalService: ModalService,
    private spinnerService: SpinnerService,
    private apiDataService: ApiDataService,
    private dataUtilService: DataUtilService
  ) { }

  ngOnInit() {
    this.getAllQueryBuilder();
    this.getEdges();

    this.modalSub = this.modalService.result.subscribe(result => {
      let type = result.formType;
      let data = result.data;
      this.queryContainer = {
        name: data.name,
        location: data.edge.Location,
        edgeName: data.edge.DisplayName,
        appLabel: data.app.Name,
        operation: data.operation
      }

      if (type !== GeneralConstant.modalDataReturnType.queryBuilder) return;
      this.createQueryBuilder();
    });

    this.subscription = this.queryMessageService.messageReadingObservable.subscribe((rs) => {
      if (rs) {
        if (!this.query || !this.selectedQueryBuilder) return;
        this.result = rs;
      }
    })
  }

  ngOnDestroy(): void {
    this.modalSub.unsubscribe();
    this.subscription.unsubscribe();
  }

  getAllQueryBuilder() {
    let getAllQueryBuilderPayload = new Payload(PayloadsConstant.query.findAllQueryBuilder, []);
    this.spinnerService.showSpinner('query-list__exe-id');
    this.apiDataService.executeQueryByServer(getAllQueryBuilderPayload, 'edge').subscribe(
      (response: any) => {
        this.queryBuilders = this.dataUtilService.wrapObjToOneElementArray(
          this.dataUtilService.convertXmlToJson(response).Find.Result
        );

        this.spinnerService.hideSpinner();
      }, (error: any) => {
        console.log('Loading error');
      }
    );
  }

  runQuery() {
    let runQueryPayload = new Payload(
      PayloadsConstant.query.container,
      [this.selectedQueryBuilder.QueryBuilder.EdgeName, this.query, this.selectedQueryBuilder.QueryBuilder.Label]
    );

    this.spinnerService.showSpinner('query-list__exe-id');
    this.apiDataService.executeQueryByServer(runQueryPayload, 'edge').subscribe(
      (response: any) => {
        this.spinnerService.hideSpinner();
      }, (error: any) => {
        console.log('Loading error');
      }
    );
  }

  showQueryBuilder() {
    this.modalService.openDataModal(
      QueryBuilderComponent,
      this.edges,
      GeneralConstant.modalDataReturnType.queryBuilder
    );
  }

  createQueryBuilder() {
    let createQueryBuilderPayload = new Payload(
      PayloadsConstant.query.createQueryBuilder,
      [this.queryContainer.name, this.queryContainer.location, this.queryContainer.edgeName, this.queryContainer.appLabel, this.queryContainer.operation]
    );
    this.spinnerService.showSpinner('query-list__exe-id');
    this.apiDataService.executeQueryByServer(createQueryBuilderPayload, 'edge').subscribe(
      (response: any) => {
        let result = this.dataUtilService.convertXmlToJson(response);
        if (result.Status === 'Success') {
          this.notificationService.addNotification('Query was created successfully', 'success');
          this.getAllQueryBuilder();
        } else {
          this.notificationService.addNotification('Query was not created successfully', 'danger');
        }
        
        this.spinnerService.hideSpinner();
      }, (error: any) => {
        console.log('Loading error');
      }
    );
  }

  buildTextAreaLineNumber() {
    let currentLines = 2000;
    let dl = document.createElement('dl');
    for (let i=0; i<currentLines; i ++) {
      let dd = document.createElement('dd');
      dd.classList.add('m-0');
      dd.innerHTML = i.toString();
      dl.appendChild(dd);
    }

    return dl.outerHTML;
  }

  getEdges() {
    let getAllEdgePayload = new Payload(PayloadsConstant.edge.getAll, []);
    this.apiDataService.executeQueryByServer(getAllEdgePayload, 'edge').subscribe(
      (response: any) => {
        this.edges = this.dataUtilService.wrapObjToOneElementArray(
          this.dataUtilService.convertXmlToJson(response).Find.Result
        );
      }, (error: any) => {
        console.log('Loading error');
      }
    );
  }

  onSelectQueryBuilder(queryBuilderId) {
    this.selectedQueryBuilder = this.queryBuilders.find(queryBuilder => {
      return queryBuilder.QueryBuilder.QueryId === queryBuilderId
    });
  }
}
