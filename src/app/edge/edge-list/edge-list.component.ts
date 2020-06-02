import { Edge } from '../../shared/models/edge';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {DataUtilService} from '../../shared/services/data-util.service';
import {GeneralConstant} from '../../shared/constants/general.constant';
import {EditEdgeComponent} from '../edit-edge/edit-edge.component';
import {NgbDropdownConfig} from '@ng-bootstrap/ng-bootstrap';
import {ModalService} from '../../shared/services/modal.service';
import {ApiDataService} from '../../shared/services/api-data.service';
import {Payload} from '../../shared/models/payload';
import {PayloadsConstant} from '../../shared/constants/payloads.constant';
import {SpinnerService} from '../../shared/services/spinner.service';
import {NotificationService} from '../../shared/services/notification.service';
import {DeviceMessageService} from '../../shared/services/device-message.service';
import { Subscription } from 'rxjs';
import { EdgeListService } from './edge-list.service';

@Component({
  selector: 'app-edge-list',
  templateUrl: './edge-list.component.html',
  styleUrls: ['./edge-list.component.scss']
})
export class EdgeListComponent implements OnInit {

  public edges: any[];
  private subscription: Subscription;
  public originalEdgeList: any[];
  public searchText: string;
  public selectedEdge: any;
  public listLimitCount: number;
  public listLimitCountDefault: number;
  public isShow: boolean = false;
  public modalSub: Subscription;
  public viewType: string;
  public fieldsValuePairs: any = [
    {
      fields: [
        {name: 'item.Edge.Region', type: 'string'},
        {name: 'item.Edge.DisplayName', type: 'string'}
      ],
      require: false
    }
  ];

  constructor(
    private dataUtilService: DataUtilService,
    private dropdownConfig: NgbDropdownConfig,
    private modalService: ModalService,
    private apiDataService: ApiDataService,
    private spinnerService: SpinnerService,
    private notificationService: NotificationService,
    private deviceMessageService: DeviceMessageService,
    private edgeListService: EdgeListService
  ) {
    this.dropdownConfig.placement = 'bottom-right';
  }

  ngOnInit() {
    this.listLimitCount = GeneralConstant.limitPaging;
    this.listLimitCountDefault = GeneralConstant.limitPaging;
    this.viewType = 'map';
    this.getAllEdge();

    this.modalSub = this.modalService.result.subscribe(result => {
      this.viewType = 'list';
      let type = result.formType;
      this.selectedEdge = result.data;

      if (type === GeneralConstant.modalDataReturnType.createEdge) {
        this.createEdge();
      } else if (type === GeneralConstant.modalDataReturnType.editEdge) {
        this.updateEdge();
      }
    });


    // this.subscription = this.deviceMessageService.messageReadingObservable.subscribe((rs) => {
    //   if (rs) {
    //     this.notificationService.addNotification('New provision came', 'success');
    //     this.getAllEdge();
    //   }
    // })
  }

  ngOnDestroy(): void {
    this.modalSub.unsubscribe();
    // this.subscription.unsubscribe();
  }

  getAllEdge() {
    let getAllEdgePayload = new Payload(PayloadsConstant.edge.getAll, []);
    this.spinnerService.showSpinner('edit-edge-spinner', GeneralConstant.smallSpinerConfig);

    this.apiDataService.executeQueryByServer(getAllEdgePayload, 'edge').subscribe(
      (response: any) => {
        this.originalEdgeList = this.dataUtilService.wrapObjToOneElementArray(
          this.dataUtilService.convertXmlToJson(response).Find.Result
        );

        if (!this.originalEdgeList) return;
        this.edges = this.edgeListService.getEdgesByLimitCount(this.originalEdgeList, this.listLimitCount);
        this.spinnerService.hideSpinner();
      }, (error: any) => {
        console.log('Loading error');
      }
    );
  }

  showUpsertEdgeForm(selectedEdge) {
    this.selectedEdge = {
      id: selectedEdge ? selectedEdge.Edge.EdgeId : '',
      name: selectedEdge ? selectedEdge.Edge.DisplayName : '',
      region: selectedEdge ? selectedEdge.Edge.Region : '',
      location: selectedEdge ? selectedEdge.Edge.Location : '',
      address1: selectedEdge ? selectedEdge.Edge.Address.AddrLine1 : '',
      address2: selectedEdge ? selectedEdge.Edge.Address.AddrLine2 : '',
      country: selectedEdge ? selectedEdge.Edge.Address.Country : '',
      zip: selectedEdge ? selectedEdge.Edge.Address.Zip : '',
      managerName: selectedEdge ? selectedEdge.Edge.Manager.Name : '',
      email: selectedEdge ? selectedEdge.Edge.Manager.Email : '',
      phone: selectedEdge ? selectedEdge.Edge.Manager.Phone : '',
      privateAddress: selectedEdge ? selectedEdge.Edge.Profile.PrivateAddress : '',
      privatePort: selectedEdge ? selectedEdge.Edge.Profile.PrivatePort : '',
      publicAddress: selectedEdge ? selectedEdge.Edge.Profile.PublicAddress : '',
      publicPort: selectedEdge ? selectedEdge.Edge.Profile.PublicPort : '',
      protocol: selectedEdge ? selectedEdge.Edge.Profile.CommProtocol : '',
      username: selectedEdge ? selectedEdge.Edge.Profile.UserName : '',
      password: selectedEdge ? selectedEdge.Edge.Profile.Password : '',
      targetSchemaAppPackage: selectedEdge ? selectedEdge.Edge.targetSchemaAppPackage.AppDownloadURL.$.Value : '',
      targetSchemaAppName: selectedEdge ? selectedEdge.Edge.targetSchemaAppPackage.Name.$.Value : '',
    };

    this.modalService.openDataModal(
      EditEdgeComponent,
      {selectedEdge: this.selectedEdge, edges: this.originalEdgeList},
      selectedEdge ? GeneralConstant.modalDataReturnType.editEdge : GeneralConstant.modalDataReturnType.createEdge
    );
  }

  createEdge() {
    let upsertEdgePayload = new Payload(
      PayloadsConstant.edge.upsert,
      [this.selectedEdge.name, this.selectedEdge.name, this.selectedEdge.region, this.selectedEdge.location, this.selectedEdge.address1, this.selectedEdge.address2,
      this.selectedEdge.country, this.selectedEdge.zip, this.selectedEdge.managerName, this.selectedEdge.email, this.selectedEdge.phone, this.selectedEdge.privateAddress,
      this.selectedEdge.privatePort, this.selectedEdge.publicAddress, this.selectedEdge.publicPort, this.selectedEdge.protocol, this.selectedEdge.username, this.selectedEdge.password,
      this.selectedEdge.targetSchemaAppPackage.AppDownloadURL.$.Value, this.selectedEdge.targetSchemaAppPackage.Name.$.Value]
    );

    this.spinnerService.showSpinner('edit-edge-spinner', GeneralConstant.smallSpinerConfig);

    this.apiDataService.executeQueryByServer(upsertEdgePayload, 'edge').subscribe(
      (response: any) => {
        let rawResponse = this.dataUtilService.convertXmlToJson(`<result>${response}</result>`);

        if (rawResponse.result.Status === 'Fail') {
          this.notificationService.addNotification(`${rawResponse.result.Message}`, 'danger');  
        } else {
          this.notificationService.addNotification(`Edge was created successfully`, 'success');
          this.getAllEdge();
        }
        
        this.spinnerService.hideSpinner();
      }, (error: any) => {
        console.log('Update error');
      }
    );
  }

  updateEdge() {
    let upsertEdgePayload = new Payload(
      PayloadsConstant.edge.upsert,
      [this.selectedEdge.name, this.selectedEdge.name, this.selectedEdge.region, this.selectedEdge.location, this.selectedEdge.address1, this.selectedEdge.address2,
      this.selectedEdge.country, this.selectedEdge.zip, this.selectedEdge.managerName, this.selectedEdge.email, this.selectedEdge.phone, this.selectedEdge.privateAddress,
      this.selectedEdge.privatePort, this.selectedEdge.publicAddress, this.selectedEdge.publicPort, this.selectedEdge.protocol, this.selectedEdge.username, this.selectedEdge.password,
      this.selectedEdge.targetSchemaAppPackage, this.selectedEdge.targetSchemaAppName]
    );
    this.spinnerService.showSpinner('edge-list-id');
    this.apiDataService.executeQueryByServer(upsertEdgePayload, 'edges').subscribe(
      (response: any) => {
        let rawResponse = this.dataUtilService.convertXmlToJson(`<result>${response}</result>`);
        this.edges = this.edgeListService.updateEdges(
          this.edges,
          this.edgeListService.formatEdge(rawResponse.result.Edge)
        );
        this.notificationService.addNotification(`Edge <b>${rawResponse.result.Device.DeviceName.$.Value}</b> was updated successfully`, 'success');
        this.spinnerService.hideSpinner();
      }, (error: any) => {
        console.log('Update error');
      }
    );
  }

  loadLessMore() {
    if (this.edges.length < this.originalEdgeList.length) {
      this.listLimitCount += this.listLimitCount;
    } else {
      this.listLimitCount = GeneralConstant.limitPaging;
    }

    this.edges = this.edgeListService.getEdgesByLimitCount(this.originalEdgeList, this.listLimitCount);
  }

  onSwitchView(type: string) {
    this.viewType = type;
  }
}
