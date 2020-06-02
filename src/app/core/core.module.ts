import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { AsideComponent } from './aside/aside.component';
import { SharedModule } from '../shared/shared.module';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { NotificationComponent } from './notification/notification.component';
import { UserManagementComponent } from './header/user-management/user-management.component';
import { EditUserInformationComponent } from './header/user-management/edit-user-information/edit-user-information.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    AsideComponent,
    BreadcrumbComponent,
    NotificationComponent
  ],
  declarations: [
    HeaderComponent,
    FooterComponent,
    AsideComponent,
    BreadcrumbComponent,
    NotificationComponent,
    UserManagementComponent,
    EditUserInformationComponent
  ],
  entryComponents: [
    EditUserInformationComponent
  ],
})
export class CoreModule {
}
