import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { GeneralConstant } from '../../shared/constants/general.constant';
import { ModalService } from '../../shared/services/modal.service';
import { Payload } from 'src/app/shared/models/payload';
import { PayloadsConstant } from 'src/app/shared/constants/payloads.constant';
import { ApiDataService } from 'src/app/shared/services/api-data.service';
import { DataUtilService } from 'src/app/shared/services/data-util.service';
import { AgmMap, LatLngBounds } from '@agm/core';

declare var google: any;
declare var he: any;

@Component({
  selector: 'app-edit-edge',
  templateUrl: './edit-edge.component.html',
  styleUrls: ['./edit-edge.component.scss']
})
export class EditEdgeComponent implements OnInit {

  @Input() dataModal: any;

  public title: string;
  public selectedEdge: any;
  public edges: any[];
  public isAddAnother: boolean;
  public countries: any[];
  public applications: any[];
  public goLocation: any;
  public errorMessage: any;

  public tabType: any;
  public edgeCreate: any;

  @ViewChild('AgmMap') agmMap: AgmMap;

  constructor(
    private modalService: ModalService,
    private apiDataService: ApiDataService,
    private dataUtilService: DataUtilService
  ) {  }

  ngOnInit() {
    this.errorMessage = {};
    this.selectedEdge = Object.assign({}, this.dataModal.selectedEdge);
    this.edges = Object.assign([], this.dataModal.edges);

    this.selectedEdge.address1 = he.decode(this.selectedEdge.address1);
    this.selectedEdge.address2 = he.decode(this.selectedEdge.address2);

    this.countries = GeneralConstant.countryList;
    this.goLocation = {
      lat: null,
      long: null
    }
    this.getAllApplication();

    this.edgeCreate = {tab: 'general'};
    this.tabType = {
      general: {
        next: 'details',
        back: null,
        done: false,
        canNext: true
      },
      details: {
        next: 'network',
        back: 'general',
        done: false,
        canNext: true
      },
      network: {
        next: null,
        back: 'details',
        done: false,
        canNext: true
      }
    };
  }

  onBackTap() {
    this.edgeCreate.tab = this.tabType[this.edgeCreate.tab].back;
    this.tabType[this.edgeCreate.tab].done = false;
  }

  onNextTap() {
    this.tabType[this.edgeCreate.tab].done = true;
    this.edgeCreate.tab = this.tabType[this.edgeCreate.tab].next;
  }

  public onSaveEdge() {
    let type: string;
    type = this.selectedEdge.id ?
      GeneralConstant.modalDataReturnType.editEdge :
      GeneralConstant.modalDataReturnType.createEdge;

    this.selectedEdge.address1 = he.encode(this.selectedEdge.address1);
    this.selectedEdge.address2 = he.encode(this.selectedEdge.address2);

    if (this.isAddAnother) {
      this.modalService.emitOutput(this.selectedEdge, type);
      this.selectedEdge = Object.assign({}, this.dataModal);
    } else {
      this.modalService.emitAndDestroy(this.selectedEdge, type);
    } 
  }

  getAllApplication() {
    let getAllApplicationPayload = new Payload(PayloadsConstant.application.getAll, []);
    this.apiDataService.executeQueryByServer(getAllApplicationPayload, 'application').subscribe(
      (response: any) => {
        let rawApplications = this.dataUtilService.convertXmlToJson(`<result>${response}</result>`);
        
        if (!rawApplications.result.Applications.Application) return;
        this.applications = this.dataUtilService.wrapObjToOneElementArray(
          rawApplications.result.Applications.Application
        );
        this.applications = this.applications.filter(app => app.IsTargetSchemaApplication.$.Value === 'true');
        
      }, (error: any) => {
        console.log('Loading error');
      }
    );
  }

  positionPlaceMarker($event) {
    this.goLocation.lat = $event.coords.lat;
    this.goLocation.long = $event.coords.lng;
    this.selectedEdge.location = `${this.goLocation.lat}, ${this.goLocation.long}`;
  }

  public close() {
    this.modalService.destroy();
  }

  public onFocusOutEdgeName() {
    if (this.selectedEdge.name === '') return;

    let isDuplicateName = this.edges.some(edge => edge.Edge.DisplayName === this.selectedEdge.name);
    this.errorMessage.duplicateEdgeName = isDuplicateName ? 'Duplicate edge id' : false;
    this.tabType.general.canNext = !isDuplicateName;
  }

  public onLocationFocusOut() {
    let locationArr = this.selectedEdge.location.split(',');
    if (locationArr.length > 1) {
      this.goLocation.lat = parseInt(locationArr[0].trim());
      this.goLocation.long = parseInt(locationArr[1].trim());
    } else {
      this.goLocation.lat = null;
      this.goLocation.long = null;
    }
    
  }
}
