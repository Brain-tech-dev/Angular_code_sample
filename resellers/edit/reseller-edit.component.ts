import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import {
  getSettings,
  getSettingValue,
  Reseller,
  ResellerSettings,
  ResellerStatus,
  SettingType,
} from '../../../../services/models';
import { convertToEnumValue } from '../../../../services/models/location.model';
import { ResellerService } from '../../../../services/reseller/reseller.service';
import { whiteSpaceValidor } from '../../../../shared/validators/WhiteSpaceValidator';

@Component({
  selector: 'app-reseller-edit',
  templateUrl: './reseller-edit.component.html',
})
export class ResellerEditComponent implements OnInit, OnDestroy {
  @Input() reseller: Reseller;
  @Input() show: boolean;
  @Output() resellerUpdated = new EventEmitter<Reseller>();
  @Output() showChange = new EventEmitter<boolean>();

  uniqueOptions: string[] = ['Yes', 'No'];
  statusOptions: string[] = [ResellerStatus[ResellerStatus.Active], ResellerStatus[ResellerStatus.Inactive]];

  resellerForm = this.fb.group({
    name: ['', [Validators.required, whiteSpaceValidor()]],
    status: ['', [Validators.required]],
    settings: this.fb.group({
      BrandName: ['', [Validators.required, whiteSpaceValidor()]],
      DomainName: [''],
      UniqueServerInstance: ['Yes', Validators.required],
    }),
    primaryContact: [''],
    email: [''],
  });

  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private resellerService: ResellerService,
    private messageService: MessageService,
    private translateService: TranslateService
  ) {}

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  ngOnInit(): void {
    this.reseller.settings = !this.reseller.settings ? [] : this.reseller.settings;
    this.reseller.settingsMaped = getSettings(this.reseller.settings);

    this.resellerForm.patchValue({
      name: this.reseller.name,
      status: ResellerStatus[this.reseller.status],
      settings: {
        BrandName: getSettingValue('BrandName', this.reseller.settingsMaped),
        DomainName: getSettingValue('DomainName', this.reseller.settingsMaped),
        UniqueServerInstance: getSettingValue('UniqueServerInstance', this.reseller.settingsMaped),
      },
    });

  }

  onSubmit() {
    let resellerValues = this.resellerForm.value;
    let settings: ResellerSettings[] = [];

    const keys = Object.keys(resellerValues.settings);
    keys.map((key) => {
      if (key === 'UniqueServerInstance') {
        settings.push({ key: key, value: resellerValues.settings[key], settingType: SettingType.boolean });
      } else {
        settings.push({ key: key, value: resellerValues.settings[key], settingType: SettingType.string });
      }
    });

    let reseller = { ...this.reseller };
    reseller.name = resellerValues.name;
    reseller.status = convertToEnumValue(resellerValues.status, ResellerStatus);
    reseller.statusText = resellerValues.status;
    reseller.settings = settings;

    
    this.resellerService.update(reseller).subscribe((response) => {
      if (response?.updated == true) {
        this.show = false;
        this.showChange.emit(this.show);
        this.resellerUpdated.emit(response.value);
      } else if (response.error) {
        this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant('Global.Error'),
          detail: response.error.message,
        });
      }
    })
  }

  onCancel() {
    this.resellerForm.reset();
    this.show = false;
    this.showChange.emit(this.show);
  }
}
