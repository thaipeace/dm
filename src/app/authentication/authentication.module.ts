import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from '../guard/auth.guard';
import { SharedModule } from '../shared/shared.module';
import { AuthenticationService } from './authentication.service';

@NgModule({
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    SharedModule
  ],
  providers: [
    AuthGuard,
    AuthenticationService
  ],
  declarations: [LoginComponent]
})
export class AuthenticationModule { }
