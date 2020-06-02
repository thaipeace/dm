import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';

const authenticationRoutes: Routes = [
  { path: 'login', component: LoginComponent, data: { 
      breadcrumb: [
        { label: "Login", url: "" },
      ]
    } 
  }
];

@NgModule({
  imports: [RouterModule.forChild(authenticationRoutes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
