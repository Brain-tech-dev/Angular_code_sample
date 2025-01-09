import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Reseller, ResellerSettings, SettingType } from '@app/services/models/reseller.models';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { domainNameValidor } from '@app/shared/validators/DomainNameValidator';
import { whiteSpaceValidor } from '@app/shared/validators/WhiteSpaceValidator';
import { ResellerService } from '@app/services/reseller/reseller.service';
import { Subscription } from 'rxjs';
import { Response } from '@app/services/models';

@Component({
  selector: 'app-reseller-add',
  templateUrl: './reseller-add.component.html',
})
export class ResellerAddPageComponent implements OnInit, OnDestroy {
  @Input() show: boolean;
  @Output() showChange = new EventEmitter<boolean>();
  @Output() resellerAdded = new EventEmitter<Response>();

  uniqueOptions: string[] = ['Yes', 'No'];

  resellerForm = this.fb.group({
    name: ['', [Validators.required, whiteSpaceValidor()]],
    settings: this.fb.group({
      BrandName: ['', [Validators.required, whiteSpaceValidor()]],
      DomainName: ['', [Validators.required, domainNameValidor()]]
    }),
    primaryContact: [''],
    email: [''],
  });


  constructor(private fb: FormBuilder, private resellerService: ResellerService) {}

  get settingsControl() {
    return this.resellerForm.get('settings') as FormGroup;
  }

  ngOnInit(): void {

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

    let reseller = {
      name: resellerValues.name,
      status: 0,
      settings: settings,
    } as Reseller;

    
    this.resellerService.create(reseller).subscribe((response) => {
      if (response.added) {
        this.resellerAdded.emit(response);
      }
      if (!response.error) {
        this.resellerForm.reset();
      }
    });
    this.show = false;
    this.showChange.emit(this.show);
  }

  onCancel() {
    this.resellerForm.reset();
    this.show = false;
    this.showChange.emit(this.show);
  }

  ngOnDestroy(): void {

  }
}
