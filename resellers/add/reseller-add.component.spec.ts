import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Response } from '@app/services/models';
import { ResellerService } from '@app/services/reseller/reseller.service';
import { TranslateModule } from '@ngx-translate/core';
import { DropdownModule } from 'primeng/dropdown';
import { of, delay } from 'rxjs';
import { ResellerAddPageComponent } from './reseller-add.component';

describe('ResellerAddPageComponent', () => {
  let component: ResellerAddPageComponent;
  let fixture: ComponentFixture<ResellerAddPageComponent>;
  let service: ResellerService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResellerAddPageComponent],
      imports: [ReactiveFormsModule, DropdownModule, HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [ResellerService],
    }).compileComponents();

    fixture = TestBed.createComponent(ResellerAddPageComponent);
    component = fixture.debugElement.componentInstance;
    service = fixture.debugElement.injector.get(ResellerService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be invalid if missing a field', () => {
    component.resellerForm.setValue({
      name: 'TotalSDS',
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

  it('should domainName validator get error with invalid value', () => {
    let settings = component.settingsControl;
    let domain = settings.controls['DomainName'];
    domain.setValue('dom ain');
    let errors = domain.errors || {};

    expect(errors['invalidDomain']).toBeTruthy();
  });

  it('should domainName validator get error with special characters in value', () => {
    let settings = component.settingsControl;
    let domain = settings.controls['DomainName'];
    domain.setValue('-total$sds');
    let errors = domain.errors || {};

    expect(errors['invalidDomain']).toBeTruthy();
  });

  it('should display message error when domainName validator fails', () => {
    let settings = component.settingsControl;
    let domain = settings.controls['DomainName'];
    domain.setValue('total--sds');
    fixture.detectChanges();

    let errorMessageEl = fixture.debugElement.nativeElement.querySelector('.text-danger');
    expect(errorMessageEl).toBeTruthy();
  });

  it('should domainName validator success with valid value', () => {
    let settings = component.settingsControl;
    let domain = settings.controls['DomainName'];
    domain.setValue('autoSDS');
    let errors = domain.errors || {};

    expect(errors['invalidDomain']).toBeFalsy();
  });

  it('should be disabled save button when form is invalid', () => {
    component.resellerForm.setValue({
      name: '',
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

  it('should add reseller', fakeAsync(() => {
    let response: Response = { value: null, added: true };
    component.resellerForm.setValue({
      name: 'TotalSDS',
      settings: {
        BrandName: 'brand',
        DomainName: 'autoSDS',
        UniqueServerInstance: 'Yes',
      },
      primaryContact: '',
      email: '',
    });

    spyOn(service, 'create');
    spyOn(service, 'hasResponseReseller').and.callFake(() => {
      return of(response).pipe(delay(2000));
    });

    component.resellerAdded.subscribe((result) => (response = result));
    component.onSubmit();
    tick(2000);

    expect(service.create).toHaveBeenCalled();
  }));
});
