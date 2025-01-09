import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  Reseller,
  ResellerSettings,
  ResellerStatus,
  SettingType,
  getSettings,
} from '@app/services/models/reseller.models';
import { ResellerService } from '@app/services/reseller/reseller.service';
import { MessageService, MenuItem } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { ManagerReseller } from '@app/services/manager/manager-reseller';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reseller-summary',
  templateUrl: './reseller-summary.component.html',
  providers: [MessageService, ManagerReseller],
})
export class ResellerSummaryComponent implements OnInit, OnDestroy {
  @Input() resellerId: number;
  @Output() resellerEdit = new EventEmitter<Reseller>();

  reseller = {} as Reseller;
  settings: ResellerSettings[] = [];
  actions: MenuItem[] = [];
  status = ResellerStatus;
  settingTypes = SettingType;

  private subscriptions: Subscription[] = [];

  constructor(
    private resellerService: ResellerService,
    private messageService: MessageService,
    private translateService: TranslateService,
    private managerReseller: ManagerReseller,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.resellerService.getById(this.resellerId, true).subscribe((response) => {
        if (response.value?.id == this.resellerId) {
          this.reseller = response.value;
          this.reseller.settings = !this.reseller.settings ? [] : this.reseller.settings;
          if (this.reseller.settings != null && this.reseller.settings != undefined && this.reseller.settings.length > 0) {
            this.reseller.settings = this.reseller.settings.filter(x => x.key != 'SDSRequestEmailTemplate');
          }
          this.reseller.settingsMaped = getSettings(this.reseller.settings);
          this.buildMenu();
        }

        if (response.error) {
          this.messageService.add({
            severity: 'error',
            summary: this.translateService.instant('Global.Error'),
            detail: response.error.error.message,
          });
        }
      })
  }

  buildMenu() {
    this.actions = [
      {
        label: $localize`See Details`,
        icon: 'pi pi-user-edit',
        command: () => {
          this.router.navigate([`/admin/reseller/details/${this.reseller.id}`]);
        },
      },
      {
        label: this.reseller.status == this.status.Active ? $localize`Deactivate` : $localize`Activate`,
        icon: this.reseller.status == this.status.Active ? 'pi pi-times-circle' : 'pi pi-check-circle',
        command: () => {
          if(this.reseller.status == this.status.Active) {
            this.managerReseller.deactivate(this.reseller.id).subscribe(() => {
              this.reseller.status = this.status.Inactive;
              this.buildMenu();
              this.messageService.add({
                severity: 'success',
                summary: this.translateService.instant('Global.Success'),
                detail: this.translateService.instant('Manager.Reseller.Deactivated'),
              });
            });
          }

          if(this.reseller.status == this.status.Inactive){
            this.managerReseller.activate(this.reseller.id).subscribe(() => {
              this.reseller.status = this.status.Active;
              this.buildMenu();
              this.messageService.add({
                severity: 'success',
                summary: this.translateService.instant('Global.Success'),
                detail: this.translateService.instant('Manager.Reseller.Activated'),
              });
            });
          }
        },
      },
      {
        label: $localize`Remove`,
        icon: 'pi pi-trash',
        command: () => {},
      },
    ];
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
