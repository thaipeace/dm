import { Component, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { DataUtilService } from '../../shared/services/data-util.service';
import { SpinnerService } from '../../shared/services/spinner.service';
import { User } from '../../shared/models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  private returnUrl: string;
  public username: string;
  public password: string;
  public message: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private dataUtilService: DataUtilService,
    private spinnerService: SpinnerService
  ) { }

  ngOnInit() {
    this.authenticationService.logout();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  async onSubmit() {
    let loginResult = await this.authenticationService.login(this.username, this.password);
    let userInfo = this.dataUtilService.convertXmlToJson(`<result>${loginResult}</result>`);
    
    if (userInfo.result.Status !== 'Failed') {
      this.authenticationService.setUser(new User(this.username, userInfo.result.Find.Result.SessionToken));
      localStorage.setItem('currentUser', JSON.stringify(this.authenticationService.user));
      this.router.navigate([this.returnUrl]);
    } else {
      this.message = userInfo.result.Message;
    }

    this.spinnerService.hideSpinner();
  }
}
