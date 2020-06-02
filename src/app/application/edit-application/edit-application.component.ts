import { Component, OnInit, Input, Output } from '@angular/core';
import { ModalService } from '../../shared/services/modal.service';
import { GeneralConstant } from '../../shared/constants/general.constant';

@Component({
  selector: 'app-edit-application',
  templateUrl: './edit-application.component.html',
  styleUrls: ['./edit-application.component.scss']
})
export class EditApplicationComponent implements OnInit {
  // Catch name from the inputs.selectedapplication in devide-list.component.ts
  @Input() dataModal: any;

  public title: string;
  public selectedApplication: any;
  public dependencies: any;
  public defaultConfiguration: any;

  constructor(
    private modalService: ModalService
  ) {  }

  ngOnInit() {
    this.selectedApplication = this.dataModal;
  }

  public onSaveApplication() {
    let type: string;
    type = this.selectedApplication.id ?
      GeneralConstant.modalDataReturnType.editApplication :
      GeneralConstant.modalDataReturnType.createApplication;

    this.modalService.emitAndDestroy(this.selectedApplication, type);
  }

  public close() {
    this.modalService.destroy();
  }
}