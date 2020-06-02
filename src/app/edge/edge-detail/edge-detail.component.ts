import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DataUtilService} from '../../shared/services/data-util.service';
import {NgbDropdownConfig} from '@ng-bootstrap/ng-bootstrap';
import {EdgeListService} from '../edge-list/edge-list.service';
import {ModalService} from '../../shared/services/modal.service';
import {EditEdgeComponent} from '../edit-edge/edit-edge.component';
import {GeneralConstant} from '../../shared/constants/general.constant';
import {ApiDataService} from '../../shared/services/api-data.service';
import {Payload} from '../../shared/models/payload';
import {PayloadsConstant} from '../../shared/constants/payloads.constant';
import {NotificationService} from '../../shared/services/notification.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { ConfirmationDialogService } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-edge-detail',
  templateUrl: './edge-detail.component.html',
  styleUrls: ['./edge-detail.component.scss']
})
export class EdgeDetailComponent implements OnInit {

  public id: number;
  public rawEdge: any;
  public edge: any;
  public displayEdge: any;
  public displayEdgeKeys: any[];
  public selectedEdge: any;
  public currentView: string;
  public displayApp: any;
  public displayAppKeys: any[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataUtilService: DataUtilService,
    private dropdownConfig: NgbDropdownConfig,
    private edgeListService: EdgeListService,
    private modalService: ModalService,
    private apiDataService: ApiDataService,
    private notificationService: NotificationService,
    private spinnerService: SpinnerService,
    private confirmationDialogService: ConfirmationDialogService
  ) {
    this.dropdownConfig.placement = 'bottom-right';
  }

  ngOnInit() {
    this.currentView = 'details';
    this.route.params.subscribe(params => {
      this.id = params['edgeId'];
      this.getEdgeById(this.id);
    });

    this.modalService.result.subscribe(result => {
      let type = result.formType;
      if (type !== GeneralConstant.modalDataReturnType.editEdge) return;
      this.selectedEdge = result.data;
      this.upsertEdge();
    });
  }

  viewContent(type: string) {
    this.currentView = type;
  }

  getEdgeById(id) {
    let getEdgeByIdPayload = new Payload(PayloadsConstant.edge.getById, [id]);
    this.apiDataService.executeQueryByServer(getEdgeByIdPayload, 'edge').subscribe(
      (response: any) => {
        this.rawEdge = this.dataUtilService.convertXmlToJsonParseAttributes(response);
        if (!this.rawEdge.Find.Result) return;
        this.edge = this.rawEdge.Find.Result.Edge;

        this.displayApp = Object.assign({},this.rawEdge.Find.Result.Edge.Applications.Application);
        this.displayAppKeys = Object.keys(this.displayApp);

        this.displayEdge = Object.assign({}, this.rawEdge.Find.Result.Edge);
        this.displayEdge = this.dataUtilService.removeObjectPropertise(
          this.displayEdge,
          ["DisplayName", "Region", "Status", "EdgeName", "Applications", "Profile", "EdgeId"]
        );
        this.displayEdgeKeys = Object.keys(this.displayEdge);
      }, (error: any) => {
        console.log('Loading error');
      }
    );
  }

  showUpsertEdgeForm() {
    this.selectedEdge = {
      id: this.edge.EdgeId,
      name: this.edge.DisplayName,
      region: this.edge.Region,
      location: this.edge.Location,
      address1: this.edge.Address.AddrLine1,
      address2: this.edge.Address.AddrLine2,
      country: this.edge.Address.Country,
      zip: this.edge.Address.Zip,
      managerName: this.edge.Manager.Name,
      email: this.edge.Manager.Email,
      phone: this.edge.Manager.Phone,
      privateAddress: this.edge.Profile.PrivateAddress,
      privatePort: this.edge.Profile.PrivatePort,
      publicAddress: this.edge.Profile.PublicAddress,
      publicPort: this.edge.Profile.PublicPort,
      protocol: this.edge.Profile.CommProtocol,
      username: this.edge.Profile.UserName
    };

    this.modalService.openDataModal(
      EditEdgeComponent,
      this.selectedEdge,
      GeneralConstant.modalDataReturnType.editEdge
    );
  }

  upsertEdge() {
    let upsertEdgePayload = new Payload(
      PayloadsConstant.edge.upsert,
      [this.selectedEdge.name, this.selectedEdge.name, this.selectedEdge.region, this.selectedEdge.location, this.selectedEdge.address1, this.selectedEdge.address2,
        this.selectedEdge.country, this.selectedEdge.zip, this.selectedEdge.managerName, this.selectedEdge.email, this.selectedEdge.phone, this.selectedEdge.privateAddress,
        this.selectedEdge.privatePort, this.selectedEdge.publicAddress, this.selectedEdge.publicPort, this.selectedEdge.protocol, this.selectedEdge.username]
    );

    this.spinnerService.showSpinner()
    this.apiDataService.executeQueryByServer(upsertEdgePayload, 'edge').subscribe(
      (response: any) => {
        let rawResponse = this.dataUtilService.convertXmlToJson(`<result>${response}</result>`);

        if (rawResponse.result.Status === 'Fail') {
          this.notificationService.addNotification(`Edge was not created successfully`, 'danger');
        } else {
          this.edge = this.edgeListService.formatEdge(rawResponse.result.edge);
          this.notificationService.addNotification(`Edge <b>${this.edge.name}</b> was created successfully`, 'success');
        }
        this.spinnerService.hideSpinner();
      }, (error: any) => {
        console.log('Update error');
      }
    );
  }

  activateEdge() {
    let activateEdgePayload = new Payload(
      PayloadsConstant.edge.activateEdge,
      [
        this.edge.DisplayName,
        this.edge.Profile.PrivateAddress || this.edge.Profile.PublicAddress,
        this.edge.Profile.PrivateAddress ? this.edge.Profile.PrivatePort : this.edge.Profile.PublicPort
      ]
    )

    this.apiDataService.executeQueryByServer(activateEdgePayload, 'edge').subscribe(
      response => {
        let rawRes = this.dataUtilService.convertXmlToJson(`<result>${response}</result>`);
        if (rawRes.result.Status === 'Success') {
          this.getEdgeById(this.id);
          this.notificationService.addNotification('Edge was activated successfully', 'success');
        } else {
          this.notificationService.addNotification(`${rawRes.result.Message}`, 'danger');
        }
      },
      error => {
        console.log('Loading error');
      }
    )
  }

  deactivateEdge() {
    let deactivateEdgePayload = new Payload(
      PayloadsConstant.edge.deactivateEdge,
      [
        this.edge.DisplayName,
        this.edge.Profile.PrivateAddress || this.edge.Profile.PublicAddress,
        this.edge.Profile.PrivateAddress ? this.edge.Profile.PrivatePort : this.edge.Profile.PublicPort
      ]
    )

    this.apiDataService.executeQueryByServer(deactivateEdgePayload, 'edge').subscribe(
      response => {
        let rawRes = this.dataUtilService.convertXmlToJson(`<result>${response}</result>`);
        if (rawRes.result.Status === 'Success') {
          this.getEdgeById(this.id);
          this.notificationService.addNotification('Edge was deactivated successfully', 'success');
        } else {
          this.notificationService.addNotification(`${rawRes.result.Message}`, 'danger');
        }
      },
      error => {
        console.log('Loading error');
      }
    )
  }

  deleteEdge() {
    this.confirmationDialogService.confirm(
      `Delete Edge`,
      `Do you really want to delete ${this.edge.DisplayName} edge ?`
    ).then((confirmed) => {
      if (confirmed) {
        let deleteEdgePayload = new Payload(PayloadsConstant.edge.deleteEdge, [this.edge.EdgeId]);
        this.spinnerService.showSpinner();
        this.apiDataService.executeQueryByServer(deleteEdgePayload, 'edge').subscribe(response => {
          let rawRes = this.dataUtilService.convertXmlToJson(`<result>${response}</result>`);
          if (rawRes.result.Status === 'Success') {
            this.notificationService.addNotification('Edge was deleted successfully', 'success');
            setTimeout(() => {
              this.router.navigate(['/edges']);
            }, 500);
          } else {
            this.notificationService.addNotification(`${rawRes.result.Message}`, 'danger');
          }
          this.spinnerService.hideSpinner();
        }, error => {
          console.log('Loading error');
        });
      }
    }).catch(() => {});
  }
}
