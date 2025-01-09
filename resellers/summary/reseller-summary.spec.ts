import { Reseller, Response } from '@app/services/models';
import { ResellerSummaryComponent } from './reseller-summary.component';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ResellerService } from '@app/services/reseller/reseller.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { delay, of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { TagModule } from 'primeng/tag';
import { HttpClient } from '@angular/common/http';
import { HttpLoaderFactory } from '@app/app.module';
import { ResellerStatus } from '@app/services/models/reseller.models';
import { SettingType } from '../../../../services/models/reseller.models';

const reseller: Reseller = {
  id: 1,
  name: 'TotalSDS',
  email: null,
  contactName: null,
  description: 'DDD',
  address: 'AA1',
  city: 'C',
  state: 'S',
  postalCode: '123456',
  plan: 0,
  createdOn: '2022-07-19T11:36:45.507102',
  status: 0,
  settings: [
    { key: 'BrandName', value: 'TotalSDS', settingType: 0 },
    { key: 'DomainName', value: 'TotalSDS', settingType: 0 },
    { key: 'UniqueServerInstance', value: '1', settingType: 1 },
  ],
  settingsMaped: [
    { key: 'BrandName', value: 'TotalSDS', settingType: 0 },
    { key: 'DomainName', value: 'TotalSDS', settingType: 0 },
    { key: 'UniqueServerInstance', value: 'Yes', settingType: 1 },
  ],
};

describe('ResellerSummaryComponent', () => {
  let component: ResellerSummaryComponent;
  let fixture: ComponentFixture<ResellerSummaryComponent>;
  let service: ResellerService;
  let messageService: MessageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResellerSummaryComponent],
      imports: [
        TagModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient],
          },
        }),
      ],
      providers: [ResellerService, MessageService, TranslateService],
    }).compileComponents();

    fixture = TestBed.createComponent(ResellerSummaryComponent);
    component = fixture.debugElement.componentInstance;
    service = fixture.debugElement.injector.get(ResellerService);
    messageService = fixture.debugElement.injector.get(MessageService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit and get a reseller', fakeAsync(() => {
    const response: Response = { value: reseller };
    component.resellerId = reseller.id;
    spyOn(component, 'buildMenu');
    spyOn(service, 'getById');
    spyOn(service, 'hasResponseReseller').and.callFake(() => {
      return of(response).pipe(delay(2000));
    });

    component.ngOnInit();
    tick(2000);
    expect(component.buildMenu).toHaveBeenCalled();
    expect(component.reseller).toEqual(response.value);
  }));

  it('should call ngOnInit and return a error', fakeAsync(() => {
    const response: Response = { value: null, error: { error: { message: 'error to get reseller' } } };
    component.resellerId = reseller.id;
    spyOn(messageService, 'add');
    spyOn(service, 'getById');
    spyOn(service, 'hasResponseReseller').and.callFake(() => {
      return of(response).pipe(delay(2000));
    });

    component.ngOnInit();
    tick(2000);
    expect(messageService.add).toHaveBeenCalled();
  }));

  it('should create actions with deactive option', () => {
    component.reseller = reseller;
    const expectedMenu = [
      {
        label: 'Edit Details',
        icon: 'pi pi-user-edit',
        command: () => {},
      },
      {
        label: 'Deactivate',
        icon: 'pi pi-times-circle',
        command: () => {},
      },
      {
        label: 'Remove',
        icon: 'pi pi-trash',
        command: () => {},
      },
    ];

    fixture.detectChanges();
    component.buildMenu();
    expect(JSON.stringify(component.actions)).toEqual(JSON.stringify(expectedMenu));
  });

  it('should create actions with activate option', () => {
    let resellerInactive = { ...reseller };
    component.reseller = resellerInactive;
    component.reseller.status = 1;
    component.reseller.statusText = 'Inactive';
    const expectedMenu = [
      {
        label: 'Edit Details',
        icon: 'pi pi-user-edit',
        command: () => {},
      },
      {
        label: $localize`Activate`,
        icon: 'pi pi-check-circle',
        command: () => {},
      },
      {
        label: 'Remove',
        icon: 'pi pi-trash',
        command: () => {},
      },
    ];

    fixture.detectChanges();
    component.buildMenu();
    expect(JSON.stringify(component.actions)).toEqual(JSON.stringify(expectedMenu));
  });

  it('should display reseller content', () => {
    component.reseller = reseller;
    fixture.detectChanges();
    let statusText = ResellerStatus[component.reseller.status];

    let statusEl = fixture.debugElement.query(By.css('.status')).nativeElement;
    let nameEl = fixture.debugElement.query(By.css('.name')).nativeElement;

    expect(statusEl.textContent).toContain(statusText);
    expect(nameEl.textContent).toContain(reseller.name);

    component.reseller.settings?.map((setting) => {
      let element = fixture.debugElement.query(By.css(`.${setting.key}`)).nativeElement;

      if (setting.settingType == SettingType.boolean) {
        let value = setting.value ? 'Yes' : 'No';
        expect(element.textContent).toContain(value);
      } else {
        expect(element.textContent).toContain(setting.value);
      }
    });
  });

  it('should display green tag for active status', () => {
    component.reseller = reseller;
    fixture.detectChanges();

    let statusEl = fixture.debugElement.query(By.css('.status')).nativeElement;
    expect(statusEl.getAttribute('styleClass')).toContain('bg-green-100');
  });

  it('should display gray tag inactive status', () => {
    let resellerInactive = { ...reseller };
    component.reseller = resellerInactive;
    component.reseller.status = 1;
    component.reseller.statusText = 'Inactive';
    fixture.detectChanges();

    let statusEl = fixture.debugElement.query(By.css('.status')).nativeElement;
    expect(statusEl.getAttribute('styleClass')).toContain('bg-gray-100');
  });
});
