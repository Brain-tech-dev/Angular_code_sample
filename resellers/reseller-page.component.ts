import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ResellerService } from '@app/services/reseller/reseller.service';
import { Reseller, ResellerStatus, Response } from '@app/services/models';
import { TableHeader } from '@app/shared/models/table-header.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ManagerReseller } from '@app/services/manager/manager-reseller';

class ViewModel {
  resellers: Reseller[];
  selectedResellers: Location[];
  _selectedColumns: TableHeader[] = [];
  showSummary: boolean;
  showAdd: boolean;
  showEdit: boolean;
  selectedId: number = 0;
  selectedReseller: Reseller;
  loading: boolean = false;
  status = ResellerStatus;
  toggleResellerStatus: boolean = false;
  cols: TableHeader[] = [
    { field: 'primaryContact', header: 'Manager.Reseller.Contact' },
    { field: 'primaryEmail', header: 'Manager.Reseller.Email' },
    { field: 'createdOn', header: 'Generic.CreatedOn' },
    { field: 'status', header: 'Generic.Status' },
  ];
}

@Component({
  templateUrl: './reseller-page.component.html',
  providers: [ResellerService, MessageService, ManagerReseller],
})
export class ResellerPageComponent implements OnInit, OnDestroy {
  vm: ViewModel = new ViewModel();
  private subscriptions: Subscription[] = [];

  constructor(
    private resellerService: ResellerService,
    private messageService: MessageService,
    private managerResellerService: ManagerReseller,
    private translateService: TranslateService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}

  get selectedColumns(): TableHeader[] {
    return this.vm._selectedColumns;
  }

  set selectedColumns(val: TableHeader[]) {
    this.vm._selectedColumns = this.vm.cols.filter((col) => val.includes(col));
  }

  ngOnInit(): void {
    this.loadResellers(false);
  }

  loadResellers(forceRefresh: boolean): void {
    this.vm.loading = true;
    this.subscriptions.push(
      this.resellerService.getAll([], forceRefresh).subscribe((result) => {
        this.vm.resellers = result;
        this.vm.loading = false;
      })
    );
    this.vm._selectedColumns = this.vm.cols;
  }

  showPreview(item: Reseller) {
    this.vm.selectedId = item.id;
    this.vm.showSummary = !this.vm.showSummary;
  }

  closePreview() {
    this.vm.selectedId = 0;
    this.vm.showSummary = false;
  }

  resellerAdded(response: Response) {
    if (response.added == true) {
      this.messageService.add({
        severity: 'success',
        summary: this.translateService.instant('Global.Success'),
        detail: this.translateService.instant('Manager.ResellerAdd.ResellerAdded'),
      });
      this.resellerService.getAll([], true);
    }
    if (response.error) {
      this.messageService.add({
        severity: 'error',
        summary: this.translateService.instant('Global.Error'),
        detail: response.error.error.message,
      });
    }
  }

  onResellerEdit(reseller: Reseller) {
    this.vm.showSummary = false;
    this.vm.showEdit = true;
    this.vm.selectedReseller = reseller;
  }

  onResellerUpdated(reseller: Reseller) {
    this.vm.resellers = this.vm.resellers.map((obj) =>
      obj.id === reseller.id ? ({ ...obj, ...reseller } as Reseller) : obj
    );

    this.messageService.add({
      severity: 'success',
      summary: this.translateService.instant('Global.Success'),
      detail: this.translateService.instant('Manager.ResellerEdit.ResellerUpdated'),
    });
  }

  redirectToDetailsPage(resellerId: number) {
    this.router.navigate([`/admin/reseller/details/${resellerId}`]);
  }

  changeResellerStatusConfirmation(reseller: Reseller) {
    if (reseller.status == ResellerStatus.Active) {
      this.confirmationService.confirm({
        header: this.translateService.instant('Manager.Reseller.Deactivate'),
        message: this.translateService.instant('Manager.Reseller.DeactivateMessage', { name: reseller.name }),
        accept: () => {
          this.changeResellerStatus(reseller);
          reseller.status = ResellerStatus.Inactive;
        }
      });
    } else {
      this.changeResellerStatus(reseller);
      reseller.status = ResellerStatus.Active;
    }
  }

  changeResellerStatus(reseller: Reseller): void {
    this.vm.toggleResellerStatus = true;
    const action =
      reseller.status === this.vm.status.Active
        ? this.managerResellerService.deactivate(reseller.id)
        : this.managerResellerService.activate(reseller.id);
    this.subscriptions.push(
      action.subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: this.translateService.instant('Global.Success'),
            detail:
              reseller.status == this.vm.status.Active
                ? this.translateService.instant('Manager.Reseller.Activated')
                : this.translateService.instant('Manager.Reseller.Deactivated'),
          });
          this.loadResellers(true);
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: this.translateService.instant('Global.Error'),
            detail: error.message,
          });
        },
        complete: () => {
          this.vm.toggleResellerStatus = false;
        },
      })
    );
  }


  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
