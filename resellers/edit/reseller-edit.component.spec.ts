import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Reseller, ResellerStatus, Response } from '@app/services/models';
import { ResellerService } from '@app/services/reseller/reseller.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { of, delay } from 'rxjs';
import { ResellerEditComponent } from './reseller-edit.component';

describe('ResellerEditComponent', () => {
  let component: ResellerEditComponent;
  let fixture: ComponentFixture<ResellerEditComponent>;
  let service: ResellerService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResellerEditComponent],
      imports: [ReactiveFormsModule, DropdownModule, HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [ResellerService, MessageService, TranslateService],
    }).compileComponents();

    fixture = TestBed.createComponent(ResellerEditComponent);
    component = fixture.debugElement.componentInstance;
    service = fixture.debugElement.injector.get(ResellerService);
    component.reseller = {
      id: 1,
      name: 'Reseller',
      description: 'description',
      address: 'address',
      city: 'city',
      state: 'state',
      postalCode: '56346',
      plan: 0,
      status: 1,
      settings: [
        {
          key: 'BrandName',
          value: 'TotalSDS',
          settingType: 0,
        },
        {
          key: 'DomainName',
          value: 'GSDS.com',
          settingType: 0,
        },
        {
          key: 'UniqueServerInstance',
          value: 'No',
          settingType: 1,
        },
      ],
    } as Reseller;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be invalid if missing a field', () => {
    component.resellerForm.setValue({
      name: 'TotalSDS',
      status: 'Active',
      settings: {
        BrandName: '',
        DomainName: 'GSDS',
        UniqueServerInstance: 'Yes',
      },
      primaryContact: '',
      email: '',
    });
    fixture.detectChanges();
    expect(component.resellerForm.invalid).toEqual(true);
  });

  it('should be valid if form value is valid', () => {
    component.resellerForm.setValue({
      name: 'TotalSDS',
      status: 'Active',
      settings: {
        BrandName: 'brand',
        DomainName: 'GSDS',
        UniqueServerInstance: 'Yes',
      },
      primaryContact: '',
      email: '',
    });
    fixture.detectChanges();
    expect(component.resellerForm.valid).toEqual(true);
  });

  it('should be disabled save button when form is invalid', () => {
    component.resellerForm.setValue({
      name: '',
      status: 'Active',
      settings: {
        BrandName: '',
        DomainName: '',
        UniqueServerInstance: '',
      },
      primaryContact: '',
      email: '',
    });
    fixture.detectChanges();
    const submitButton = fixture.debugElement.nativeElement.querySelector('.btn-submit');
    expect(submitButton.disabled).toBeTruthy();
  });

  it('should be enable save button when form is valid', () => {
    component.resellerForm.setValue({
      name: 'TotalSDS',
      status: 'Active',
      settings: {
        BrandName: 'Test',
        DomainName: 'autoSDS',
        UniqueServerInstance: 'Yes',
      },
      primaryContact: '',
      email: '',
    });
    fixture.detectChanges();

    const submitButton = fixture.debugElement.nativeElement.querySelector('.btn-submit');
    expect(submitButton.disabled).toBeFalsy();
  });

  it('should call onCancel when click cancel button', () => {
    spyOn(component, 'onCancel');

    const cancelButton = fixture.debugElement.nativeElement.querySelector('.btn-cancel');
    cancelButton.click();
    fixture.detectChanges();

    expect(component.onCancel).toHaveBeenCalled();
  });

  it('should update reseller', fakeAsync(() => {
    let reseller = {
      id: 1,
      name: 'Reseller',
      description: 'description',
      address: 'address',
      city: 'city',
      state: 'state',
      postalCode: '56346',
      plan: 0,
      status: 1,
      settings: [
        {
          key: 'BrandName',
          value: 'TotalSDS',
          settingType: 0,
        },
        {
          key: 'DomainName',
          value: 'GSDS.com',
          settingType: 0,
        },
        {
          key: 'UniqueServerInstance',
          value: 'No',
          settingType: 1,
        },
      ],
    } as Reseller;

    let response: Response = { value: reseller, updated: true };
    component.resellerForm.setValue({
      name: 'TotalSDS',
      status: 'Active',
      settings: {
        BrandName: 'brand',
        DomainName: 'autoSDS',
        UniqueServerInstance: 'Yes',
      },
      primaryContact: '',
      email: '',
    });

    spyOn(service, 'update');
    spyOn(service, 'hasResponseReseller').and.callFake(() => {
      return of(response).pipe(delay(2000));
    });

    component.resellerUpdated.subscribe((result) => reseller);
    component.onSubmit();
    tick(2000);

    expect(service.update).toHaveBeenCalled();
  }));
});
