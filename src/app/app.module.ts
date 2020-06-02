import {BrowserModule} from '@angular/platform-browser';
import {NgModule, APP_INITIALIZER} from '@angular/core';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {CoreModule} from './core/core.module';
import {SharedModule} from './shared/shared.module';
import {RouterModule} from '@angular/router';
import {DeviceModule} from './device/device.module';
import {CertificateModule} from './certificate/certificate.module';
import { AuthenticationModule } from './authentication/authentication.module';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {BootstrapModalModule} from 'ng2-bootstrap-modal';

/*cluster*/
import {ClusterModule} from "./cluster/cluster.module";
import { UserTokenInterceptor } from './helpers/user-token.interceptor';
import { ErrorInterceptor } from './helpers/error.interceptor';
import { AppConfigService } from './app-config.service';
import { EdgeModule } from './edge/edge.module';
import { AgmCoreModule } from '@agm/core';
import { ApplicationModule } from './application/application.module';
import { QueryModule } from './query/query.module';
import { DataModule } from './data/data.module';

export function initializeApp(appConfigService: AppConfigService) {
  return () => appConfigService.loadJSON();
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule.forRoot([]),
    CoreModule,
    SharedModule,
    DeviceModule,
    ClusterModule,
    CertificateModule,
    // EdgeModule,
    ApplicationModule,
    AuthenticationModule,
    // QueryModule,
    // DataModule,
    BootstrapModalModule.forRoot({container: document.body}),
    AgmCoreModule.forRoot({ apiKey: 'AIzaSyDpEj9HxyEcxum6NTmoBCM0CWEpr_c_-ug' })
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: UserTokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    AppConfigService,
    { provide: APP_INITIALIZER, useFactory: initializeApp, deps: [AppConfigService], multi: true }

  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
