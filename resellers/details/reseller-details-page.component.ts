import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResellerService } from '@app/services/reseller/reseller.service';
import { AccountServiceV2 } from '@app/services/v2/account-service-v2';
import { AccountService } from '@app/services/account-service';
import { Reseller, ResellerStatus } from '@app/services/models';
import { lastValueFrom, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AccountLibraryService } from '@app/services/sds-library/account-library.service';
import { AuthorizationService } from '@app/services/profile/authorization.service';
import { roles } from '@app/consts/roles';
import { UserService } from '@app/services/user/user.service';
import { ResellerUser } from '@app/services/models/reseller-user.model';
import { TranslateService } from '@ngx-translate/core';
import { UIManagerService } from '@app/services/ui-manager-service/ui-manager-service';
import { AccountResellerIdFilter } from '@app/services/filters/account';
import { MessageService } from 'primeng/api';
import { Promotion, PromotionsService } from '@app/services/reseller/promotions.service';

class ViewModel {
  reseller: Reseller;
  numberOfAccounts: number = 0;
  loading: boolean = true;
  ResellerStatus = ResellerStatus;
  numberOfProductsInLibrary: number;
  usersList: ResellerUser[] = [];
  isSystemAdmin: boolean = false;
  visibleAddResellerUser: boolean = false;
  visibleAddPromoCode: boolean = false;
  showDeleteDialog: boolean;
  currentUserForDeletion: ResellerUser;
  currentPromotionForDeletion: Promotion;
}


@Component({
  templateUrl: './reseller-details-page.component.html',
  styleUrls: ['./reseller-details-page.component.css'],
  providers: [PromotionsService],
})
export class ResellerDetailsPageComponent implements OnInit, OnDestroy {

  public viewModel: ViewModel = new ViewModel();

  private unsubscribe: Subject<void> = new Subject<void>();

  promocodeList: any[] = [];
  promocode: any;
  newPromoCode: any;
  isEditMode = false;
  selectedPromoCodeData: any = null;
  displayConfirmationDialog: boolean = false;
  promoCodeToDelete: any;
  tooltip_Grid_Data: any;
  tooltip_info: boolean | undefined = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private resellerService: ResellerService,
    private authService: AuthorizationService,
    private accountServiceV2: AccountServiceV2,
    private accountService: AccountService,
    private accountLibraryService: AccountLibraryService,
    private messageService: UIManagerService,
    private messageservice: MessageService,
    private translateService: TranslateService,
    private promotionService: PromotionsService,
  ) { }

  ngOnInit() {
    this.viewModel.isSystemAdmin = this.authService.isOnSystemRole(roles.SYSTEM_ADMIN);
    this.route.params.pipe(takeUntil(this.unsubscribe)).subscribe(params => {
      const id = +params['id'];
      this.initializeResellerDetails(id);
      this.loadAccountLibraryCount(id);
      this.fetchAccountsInReseller(id);
      this.loadPromotions(id);
    });

    this.handleUserServiceActions();
  }

  private initializeResellerDetails(id: number) {
    this.resellerService.getById(id, true, true).pipe(takeUntil(this.unsubscribe)).subscribe(response => {
      if (response.value) {
        this.viewModel.reseller = response.value;
        this.viewModel.loading = false;
        this.refreshUsersList();
      }
    });
  }

  private refreshUsersList() {
    this.userService.getUsersByResellerId(this.viewModel.reseller.id).subscribe(users => {
      this.viewModel.usersList = users.reverse();
    });
  }

  getResellerStatusText(status?: ResellerStatus): string {
    return status === undefined ? '' : ResellerStatus[status];
  }

  private loadAccountLibraryCount(resellerId: number) {
    this.accountLibraryService.countAccountLibrariesByReseller(resellerId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(count => {
        this.viewModel.numberOfProductsInLibrary = count;
      });
  }

  private fetchAccountsInReseller(resellerId: number) {
    this.accountService.countAccountsByReseller(resellerId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response: any) => {
        this.viewModel.numberOfAccounts = response.count;
      });
  }

  getUserStatusDetails(status: number): { value: string, styleClass: string } {
    switch (status) {
      case 1:
        return { value: "Active", styleClass: "bg-green-100 text-green-600" };
      case 2:
        return { value: "Inactive", styleClass: "bg-red-100 text-gray-600" };
      default:
        return { value: "Invited", styleClass: "bg-gray-100 text-gray-600" };
    }
  }

  public deleteUser(user: ResellerUser) {
    this.userService.deleteUser(user.id, `${user.firstName} ${user.lastName}`);
  }

  setCurrentUserForDeletion(user: ResellerUser) {
    this.viewModel.currentUserForDeletion = user;
  }

  backButton() {
    this.router.navigate(['admin/resellers']);
  }

  hideDeleteDialog() {
    this.viewModel.showDeleteDialog = false;
  }

  onResellerUserAdd(isUpdated: boolean) {
    if (isUpdated) {
      this.refreshUsersList();
    }
    this.viewModel.visibleAddResellerUser = false;
  }

  private handleUserServiceActions() {
    this.userService.hasResponseUserAction().pipe(takeUntil(this.unsubscribe)).subscribe(response => {
      if (response?.deleted || response?.error) {
        this.hideDeleteDialog();
        this.refreshUsersList();
        let messageKey = response?.deleted ? 'Manager.ResellerUser.DeleteResellerUserSuccess' : 'Manager.User.Error';
        this.messageService.raiseMessage({
          type: response?.deleted ? 'success' : 'error',
          message: 'Success!',
          subject: this.translateService.instant(messageKey),
        });
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  async customizationChanged(reseller: Reseller) {
    let result = await lastValueFrom(this.resellerService.update(reseller));
    let isError = result.updated == false;
    this.viewModel.reseller = reseller;

    this.messageService.raiseMessage({
      type: isError ? 'error' : '',
      message: isError ? this.translateService.instant('Global.Error') : this.translateService.instant('Manager.ResellerEdit.ResellerUpdated'),
      subject: result.error != null ? result.error.message : this.translateService.instant('Manager.ResellerEdit.ResellerUpdated')
    });
  }

  loadPromotions(resellerId: any): void {
    this.promotionService.getPromoCode(resellerId).subscribe({
      next: (data: any[]) => {
        this.promocodeList = data.map(item => ({
          ...item.promotionResult,
          qty: item.qty
        }));
      }
    });
  }

  editPromocode(promocode: any): void {
    this.selectedPromoCodeData = promocode;
    this.isEditMode = true;
    this.viewModel.visibleAddPromoCode = true;
  }

  onAddPromoCodeClick() {
    this.isEditMode = false;
    this.viewModel.visibleAddPromoCode = true;
    this.selectedPromoCodeData = null;
  }

  onClosePromoCodeDialog() {
    this.viewModel.visibleAddPromoCode = false;
  }

  onPromoCodeAdded(promoCode: any) {
    const resellerId = this.route.snapshot.params['id'];
    this.promocodeList.push(promoCode);
    this.viewModel.visibleAddPromoCode = false;
    this.loadPromotions(+resellerId);
  }

  setCurrentPromotionForDeletion(promocode: Promotion): void {
    this.viewModel.currentPromotionForDeletion = promocode;
    this.viewModel.showDeleteDialog = true;
  }

  hideDeleteDialogPromo() {
    this.viewModel.showDeleteDialog = false;
  }

  deletePromoCode(): void {
    const promoCodeId = this.viewModel.currentPromotionForDeletion?.id;
    if (!promoCodeId) {
      return;
    }

    this.deleteItem(promoCodeId);
  }

  deleteItem(id: number): void {
    if (!id) {
      this.messageservice.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Invalid id'
      });
      return;
    }

    this.promotionService.deletePromotion(id).subscribe({
      next: () => {
        this.promocodeList = this.promocodeList.filter(
          (promo) => promo.id !== id
        );
        this.messageservice.add({
          severity: 'success',
          summary: 'Delete',
          detail: 'Promotion deleted successfully!',
        });
        this.viewModel.showDeleteDialog = false;
      },
      error: (error) => {
        this.messageservice.add({
          severity: 'error',
          summary: 'Error',
          detail: `Error deleting item: ${error.message}`,
        });
      },
    });
  }

  onCancel(): void {
    this.viewModel.visibleAddPromoCode = false;
    this.isEditMode = false;
    this.selectedPromoCodeData = null;
  }

  tooltip_Data(tooltip_info_Data: any) {
    this.tooltip_info = true;
    this.tooltip_Grid_Data = tooltip_info_Data;
  }

}
