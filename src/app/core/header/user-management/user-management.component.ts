import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../authentication/authentication.service';
import { User } from '../../../shared/models/user';
import { AuthGuard } from '../../../guard/auth.guard';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { Payload } from '../../../shared/models/payload';
import { PayloadsConstant } from '../../../shared/constants/payloads.constant';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { ApiDataService } from '../../../shared/services/api-data.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { ModalService } from '../../../shared/services/modal.service';
import { EditUserInformationComponent } from './edit-user-information/edit-user-information.component';
import { GeneralConstant } from '../../../shared/constants/general.constant';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  public user: User;
  public isDropdownOpen = false;

  constructor(
    private auth : AuthGuard,
    private dropdownConfig: NgbDropdownConfig,
    private spinnerService: SpinnerService,
    private apiDataService: ApiDataService,
    private notificationService: NotificationService,
    private modalService: ModalService,
    private authenticationService: AuthenticationService
  ) { 
    this.dropdownConfig.placement = 'bottom-right';
  }

  ngOnInit() {
    this.auth.user.subscribe(user => {
      this.user = user;
    });

    this.modalService.result.subscribe(result => {
      let type = result.formType;
      let data = result.data;
      if (type === GeneralConstant.modalDataReturnType.editUser) {
        this.updateUser(data);
      }
    })
  }

  showUpdateUserDialog() {
    this.modalService.openDataModal(
      EditUserInformationComponent,
      this.user,
      GeneralConstant.modalDataReturnType.editUser
    );
  }

  resetUserLoginInformation() {
    let spinnerCustomer = {
      length: 4,
      width: 4,
      radius: 4,
      color: '#fff'
    };
    this.spinnerService.showSpinner('user-manage');

    let resetPayload = new Payload(PayloadsConstant.resetLoginInfor, []);
    this.apiDataService.executeQuery(resetPayload).subscribe(response => {
      this.spinnerService.hideSpinner();
      this.authenticationService.logout();
      location.reload(true);
    }, (error: any) => {
      console.log('Loading error');
    });
  }

  updateUser(data) {
    let spinnerCustomer = {
      length: 4,
      width: 4,
      radius: 4,
      color: '#fff'
    };
    this.spinnerService.showSpinner('user-manage');
    
    let updateUserPayload = new Payload(PayloadsConstant.updateLoginInfor, [data.username, data.password]);
    this.apiDataService.executeQuery(updateUserPayload).subscribe(response => {
      this.spinnerService.hideSpinner();
      this.authenticationService.logout();
      location.reload(true);
    }, (error: any) => {
      console.log('Loading error');
    });
  }

  logout() {
    let spinnerCustomer = {
      length: 4,
      width: 4,
      radius: 4,
      color: '#fff'
    };
    this.spinnerService.showSpinner('user-manage');

    let logoutPayload = new Payload(PayloadsConstant.logout, [this.user.Token]);
    this.apiDataService.executeQueryLogin(logoutPayload).subscribe(response => {
      this.spinnerService.hideSpinner();
      this.authenticationService.logout();
      location.reload(true);
    }, (error: any) => {
      console.log('Loading error');
    });
  }

}
