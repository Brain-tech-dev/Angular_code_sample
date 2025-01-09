import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Groups, LocationFeature } from '@app/services/models';
import { GroupParameter, ResellerUser, RoleType } from '@app/services/models/reseller-user.model';
import { UIManagerService } from '@app/services/ui-manager-service/ui-manager-service';
import { UserService } from '@app/services/user/user.service';
import { SortByName } from '@app/shared/helpers/SortFunctions';
import { TranslateService } from '@ngx-translate/core';
import { Subject, finalize, takeUntil } from 'rxjs';

class ModelView {
  groups : Groups[] = [];
  users: ResellerUser[] = [];
  usersFiltered: string[]=[];
  selectedUser?: ResellerUser;
  isSubmitting: boolean = false;
}

@Component({
  selector: 'app-reseller-add-user',
  templateUrl: './reseller-add-user.component.html',
  styleUrls: ['./reseller-add-user.component.scss']
})

export class ResellerAddUserComponent implements OnInit {

  @Input() resellerId: number;
  @Input() showDialog: boolean;
  @Output() userAdded = new EventEmitter<boolean>();

  public userForm: FormGroup;
  public modelView : ModelView = new ModelView();
  private unsubscribe = new Subject();

  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private messageService: UIManagerService,
              private translateService: TranslateService  
  ) { }

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      roles: ['', Validators.required]
    });

    this.userService.loadGroups();

    this.userService.getGroups().pipe(takeUntil(this.unsubscribe)).subscribe((result) => {
      let relevantGroups = ['Reseller Admin'];
      this.modelView.groups = result.filter(p => relevantGroups.indexOf(p.name) != -1 ).sort(SortByName);
    });
  }

  onFormSubmit() {
    this.modelView.isSubmitting = true;
    if (this.userForm.valid) {
      const email = this.userForm.value.email;
      const rolesAsGroupId = this.userForm.value.roles;
      const referenceId = this.resellerId;

      const groups: GroupParameter[] = [{
        groupId: rolesAsGroupId,
        referenceId: referenceId,
        roleType: RoleType.Reseller
      }];

      this.userService.addUserToSystemWithGroups(email, groups).pipe(
        takeUntil(this.unsubscribe),
        finalize(() => this.modelView.isSubmitting = false)).subscribe((result) => {
        const messageType = result.success ? 'success' : 'error';
        const subjectTemplateKey = result.success ? 'Manager.User.InviteUserSuccess' : 'Manager.User.Error';

        this.messageService.raiseMessage({
          type: messageType,
          message: result.success ? 'Success!' : 'Error!',
          subject: this.translateService.instant(subjectTemplateKey, { name: email, error: result.message })
        });
        this.userForm.reset();
        this.userAdded.emit(result.success);
      });
    }
  }

  filterForUserOptions($event) {
    this.modelView.usersFiltered = this.modelView.users.map(p => p.email).filter(p => p.indexOf($event.query) != -1)
  }

  onCancel() {
    this.userForm.reset();
    this.showDialog = false;
  }

}


