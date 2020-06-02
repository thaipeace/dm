import { Component, OnInit, Input } from '@angular/core';
import { DataUtilService } from '../../../shared/services/data-util.service';

@Component({
  selector: 'app-certificate-detail-details',
  templateUrl: './certificate-detail-details.component.html',
  styleUrls: ['./certificate-detail-details.component.scss']
})
export class CertificateDetailDetailsComponent implements OnInit {

  @Input() certificate;
  public certificateKeys: any[];

  constructor(
    public dataUtilService: DataUtilService
  ) { }

  ngOnInit() {
    this.certificateKeys = Object.keys(this.certificate);
  }

}
