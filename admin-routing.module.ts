import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountDetailsComponent, AccountsPageComponent } from '@app/pages/admin/accounts/containers';
import { AdminLocationsComponent } from './locations/containers/admin-locations/admin-locations.component';
import { ResellerPageComponent } from '@app/pages/admin/resellers/reseller-page.component';
import { ResellerDetailsPageComponent } from '@app/pages/admin/resellers/details/reseller-details-page.component';
import { DataEntryComponent } from './data-entry/data-entry.component';
import { UserPageComponent } from '@app/pages/admin/users/user-page.component';
import { ResellerUsersPageComponent  } from '@app/pages/admin/users/reseller-users/reseller-users-page.component';
import { AuthGuard } from '../auth/guards/auth.guard';
import { DataEntryEditComponent } from './data-entry/data-entry-edit/data-entry-edit.component';
import { UserContinueSetupComponent } from './users/user-continue-setup/user-continue-setup.component';
import { BatchPageComponent } from '@app/pages/admin/batches/batch-page/batch-page.component';
import { BatchAddComponent } from '@app/pages/admin/batches/batch-add/batch-add.component';
import { MessagesListComponent } from '@app/pages/admin/messages/messages-list/messages-list.component';
import { ApiCatalogComponent } from './Catalog/api-catalog/api-catalog.component';
import { SkuContentsComponent } from './Catalog/sku-contents/sku-contents.component';

const routes: Routes = [
  {
    path: 'accounts',
    component: AccountsPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'locations/:resellerid/:id',
    component: AdminLocationsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'resellers',
    component: ResellerPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'reseller/details/:id',
    component: ResellerDetailsPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'data-entry',
    component: DataEntryComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'data-entry/:id',
    component: DataEntryEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'resellers/:id/users',
    component: ResellerUsersPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'users',
    component: UserPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'catalogs',
    component: ApiCatalogComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'catalogs/sku-contents/:resellerId/:id',
    component: SkuContentsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'account/details/:id',
    component: AccountDetailsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'batch',
    component: BatchPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'batchAdd',
    component: BatchAddComponent,
    canActivate: [AuthGuard],
  },
  {
    path:'messages',
    component:MessagesListComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
