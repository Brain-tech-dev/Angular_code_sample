import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AdminRoutingModule } from './admin-routing.module';

import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SidebarModule } from 'primeng/sidebar';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { ToolbarModule } from 'primeng/toolbar';
import { ListboxModule } from 'primeng/listbox';
import { PanelModule } from 'primeng/panel';
import { InputNumberModule } from 'primeng/inputnumber';
import {MessageModule} from 'primeng/message';

import { SharedModule } from '../../shared/shared.module';
import { AccountsPageComponent } from './accounts/containers/accounts-page/accounts-page.component';
import { AccountAddPageComponent } from './accounts/containers/account-add/account-add.component';
import { AccountSummaryComponent } from './accounts/containers/account-summary/account-summary.component';
import { AccountEditComponent } from './accounts/containers/account-edit/account-edit.component';
import { MenuModule } from 'primeng/menu';
import { AdminLocationsComponent } from './locations/containers/admin-locations/admin-locations.component';
import { DateFilterModule } from '../library/dialogs/date-filter.module';
import { LocationAddPageComponent } from './locations/containers/location-add/location-add.component';
import { AdminLocationsSummaryComponent } from './locations/containers/admin-locations-summary/admin-locations-summary.component';
import { ResellerPageComponent } from '@app/pages/admin/resellers/reseller-page.component';
import { DataEntryComponent } from '@app/pages/admin/data-entry/data-entry.component';
import { CalendarModule } from 'primeng/calendar';
import { LocationEditComponent } from './locations/containers/location-edit/location-edit.component';
import { ResellerSummaryComponent } from './resellers/summary/reseller-summary.component';
import { ResellerAddPageComponent } from './resellers/add/reseller-add.component';
import { ResellerEditComponent } from './resellers/edit/reseller-edit.component';
import { UserPageComponent } from '@app/pages/admin/users/user-page.component';
import { ResellerUsersPageComponent } from '@app/pages/admin/users/reseller-users/reseller-users-page.component';
import { AdminUserSummaryComponent } from './users/user-summary/admin-user-summary.component';
import { DataEntryDocumentDialogComponent } from './data-entry/data-entry-document-dialog/data-entry-document-dialog.component';
import { DataEntryIngredientsComponent } from './data-entry/data-entry-ingredients/data-entry-ingredients.component';
import { UserAddComponent } from './users/user-add/user-add.component';
import { DataEntryEditComponent } from './data-entry/data-entry-edit/data-entry-edit.component';
import { UserContinueSetupComponent } from './users/user-continue-setup/user-continue-setup.component';
import { AccountDetailsComponent } from './accounts/containers/account-details/account-details.component';
import { ResellerDetailsPageComponent } from './resellers/details/reseller-details-page.component';
import { AccountAddUserComponent } from './accounts/containers/account-add-user/account-add-user.component';
import { DataEntryAdditionalFieldsComponent } from './data-entry/data-entry-additional-fields/data-entry-additional-fields.component';
import { DisplayLocationAdminsComponent } from './locations/containers/display-location-admins/display-admin-locations.component';
import { DisplayLocationUrlComponent } from './locations/containers/display-location-url/display-location-url.component';
import { AccountTransferComponent } from './accounts/containers';
import { AppLibraryEditDocumentDialogComponent } from '../library/dialogs/library-details-edit-document-dialog.component';
import { TabViewModule } from 'primeng/tabview';
import { AccordionModule } from 'primeng/accordion';
import { AccountAdminSettingsComponent } from '@app/pages/admin/accounts/containers';
import { InputSwitchModule } from 'primeng/inputswitch';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ColorPickerModule} from 'primeng/colorpicker';
import { SafetySearchCustomizationLogosAccordion } from './accounts/containers/account-details/components/safety-search-customization-logos-accordion.component';
import { SafetySearchCustomizationColorsAccordion } from './accounts/containers/account-details/components/safety-search-customization-colors-accordion.component';
import { SafetySearchCustomizationSettingsAccordion } from './accounts/containers/account-details/components/safety-search-customization-settings-accordion.component';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { BatchPageComponent } from '@app/pages/admin/batches/batch-page/batch-page.component';
import { BatchPriorityModalComponent } from '@app/pages/admin/batches/batch-priority-modal/batch-priority-modal.component';
import { OrderListModule } from 'primeng/orderlist';
import { BatchAddComponent } from '@app/pages/admin/batches/batch-add/batch-add.component';
import { ConfirmationService } from 'primeng/api';
import { ResellerAddUserComponent } from './resellers/add-user/reseller-add-user.component';
import { ResellerCustomizationComponent } from '@app/pages/admin/resellers/customization/reseller-customization.component';
import { TooltipModule } from 'primeng/tooltip';
import { MessagesListComponent } from '@app/pages/admin/messages/messages-list/messages-list.component';
import { ApiCatalogComponent } from './Catalog/api-catalog/api-catalog.component';
import { SkuContentsComponent } from './Catalog/sku-contents/sku-contents.component';
import { AddTSDSDialogComponent } from './Catalog/add-tsdsdialog/add-tsdsdialog.component';
import { FileUploadComponent } from './Catalog/file-upload/file-upload.component';
import { AddPromoCodeComponent } from './resellers/add-promo-code/add-promo-code.component';

@NgModule({
  declarations: [
    BatchAddComponent,
    BatchPageComponent,
    BatchPriorityModalComponent,
    DisplayLocationAdminsComponent,
    DisplayLocationUrlComponent,
    AccountsPageComponent,
    AccountAddPageComponent,
    AdminLocationsComponent,
    AccountSummaryComponent,
    LocationAddPageComponent,
    AccountEditComponent,
    AccountTransferComponent,
    ResellerPageComponent,
    ResellerSummaryComponent,
    ResellerAddPageComponent,
    ResellerEditComponent,
    AdminLocationsSummaryComponent,
    DataEntryComponent,
    LocationEditComponent,
    UserPageComponent,
    AdminUserSummaryComponent,
    DataEntryDocumentDialogComponent,
    DataEntryIngredientsComponent,
    UserAddComponent,
    DataEntryEditComponent,
    UserContinueSetupComponent,
    AccountDetailsComponent,
    AccountAddUserComponent,
    DataEntryAdditionalFieldsComponent,
    AppLibraryEditDocumentDialogComponent,
    AccountAdminSettingsComponent,
    SafetySearchCustomizationLogosAccordion,
    SafetySearchCustomizationColorsAccordion,
    SafetySearchCustomizationSettingsAccordion,
    ResellerUsersPageComponent,
    ResellerDetailsPageComponent,
    ResellerAddUserComponent,
    ResellerCustomizationComponent,
    MessagesListComponent,
    ApiCatalogComponent,
    SkuContentsComponent,
    AddTSDSDialogComponent,
    FileUploadComponent,
    AddPromoCodeComponent,
  ],
  imports: [
    CommonModule,
    DateFilterModule,
    TranslateModule,
    AdminRoutingModule,
    TooltipModule,
    ButtonModule,
    RippleModule,
    TableModule,
    MenuModule,
    MultiSelectModule,
    SidebarModule,
    InputTextModule,
    CheckboxModule,
    DropdownModule,
    FormsModule,
    SharedModule,
    ToastModule,
    CalendarModule,
    ReactiveFormsModule,
    DialogModule,
    FileUploadModule,
    ToolbarModule,
    ListboxModule,
    PanelModule,
    InputNumberModule,
    MessageModule,
    TabViewModule,
    AccordionModule,
    InputSwitchModule,
    FileUploadModule,
    ConfirmDialogModule,
    ColorPickerModule,
    ProgressSpinnerModule,
    AutoCompleteModule,
    OrderListModule
  ],
  providers: [
    ConfirmationService
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AdminModule {}
