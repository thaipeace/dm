import { Injectable } from '@angular/core';
import { Payload } from '../shared/models/payload';
import { PayloadsConstant } from '../shared/constants/payloads.constant';
import { SpinnerService } from '../shared/services/spinner.service';
import { ApiDataService } from '../shared/services/api-data.service';
import { User } from '../shared/models/user';

@Injectable()
export class AuthenticationService {
    public user: User;

    constructor(
      private spinnerService: SpinnerService,
      private apiDataService: ApiDataService,
    ) { }

    login(username: string, password: string): Promise<any> {
        let loginPayload = new Payload(PayloadsConstant.login, [username, password]);
        this.spinnerService.showSpinner('login-wrapper-id');
        return this.apiDataService.executeQueryLogin(loginPayload).toPromise();
    }

    logout() {
        localStorage.removeItem('currentUser');
    }

    setUser(user: User): void {
        this.user = user;
    }

    getUser(): Promise<User> {
        return JSON.parse(localStorage.getItem('currentUser'));
    }
}