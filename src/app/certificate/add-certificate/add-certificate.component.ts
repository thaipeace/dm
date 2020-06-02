import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../shared/services/modal.service';
import { GeneralConstant } from '../../shared/constants/general.constant';

@Component({
  selector: 'app-add-certificate',
  templateUrl: './add-certificate.component.html',
  styleUrls: ['./add-certificate.component.scss']
})
export class AddCertificateComponent implements OnInit {
  // Catch name from the inputs.selectedDevice in devide-list.component.ts

  public title: string;
  public name: string;
  public downloadLink: string;

  constructor(
    private modalService: ModalService
  ) {}

  ngOnInit() {
  }

  public onSave(createNew: boolean) {
    this.modalService.emitAndDestroy(
      {createNew: createNew, value: createNew ? this.name : this.downloadLink},
      GeneralConstant.modalDataReturnType.createCertificate
    );
  }

  public close() {
    this.modalService.destroy();
  }

}
