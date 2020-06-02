import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthenticationService } from '../authentication/authentication.service';
import { DataUtilService } from '../shared/services/data-util.service';
 
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(
        private authenticationService: AuthenticationService,
        private dataUtilService: DataUtilService
    ) {}
 
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(tap(event => {
            if (event instanceof HttpResponse) {
                let response = this.dataUtilService.convertXmlToJson(event.body);
                if (response.AuthorizeFail) {
                    this.authenticationService.logout();
                    location.reload(true);
                }
            }
        }))
    }
}