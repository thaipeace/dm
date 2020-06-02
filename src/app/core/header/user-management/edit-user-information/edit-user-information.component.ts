import { Component, OnInit, Input } from '@angular/core';
import { ModalService } from '../../../../shared/services/modal.service';
import { GeneralConstant } from '../../../../shared/constants/general.constant';
import { User } from '../../../../shared/models/user';

@Component({
  selector: 'app-edit-user-information',
  templateUrl: './edit-user-information.component.html',
  styleUrls: ['./edit-user-information.component.scss']
})
export class EditUserInformationComponent implements OnInit {

  @Input() dataModal: User;

  public title: string;
  public password: string = '';
  public username: string = '';

  constructor(
    private modalService: ModalService
  ) {  }

  ngOnInit() {
    this.username = this.dataModal.Username;
    this.title = GeneralConstant.modalDataReturnType.editUser;
  }

  public onSaveUser() {

    this.modalService.emitAndDestroy(
      {
        'username': this.username,
        'password': this.password
      },
      GeneralConstant.modalDataReturnType.editUser
    );
  }

  public close() {
    this.modalService.destroy();
  }

}
