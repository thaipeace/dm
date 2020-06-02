import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
 
@Injectable()
export class UserTokenInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            // request = request.clone({
            //     setHeaders: { 
            //         'x-atomiton-session-key': JSON.parse(currentUser).SessionToken
            //     }
            // });
        }
 
        return next.handle(request);
    }
}