import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ResellerPageComponent } from './reseller-page.component';
import { ResellerService } from '@app/services/reseller/reseller.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { delay, of } from 'rxjs';
import { Reseller, ResellerStatus } from '@app/services/models/reseller.models';
import { TableModule } from 'primeng/table';
import { By } from '@angular/platform-browser';
import { Response } from '@app/services/models';
import { Message, MessageService } from 'primeng/api';

const response: Reseller[] = [
  {
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
    statusText: 'Active',
    createdOnDate: new Date('2022-07-19T11:36:45.507102'),
  },
  {
    id: 2,
    name: 'Reseller 1',
    email: 'reseller1@mail.com',
    contactName: null,
    description: 'description of reseller',
    address: 'address',
    city: 'City',
    state: 'State',
    postalCode: '546752',
    plan: 0,
    createdOn: '2022-07-22T11:36:45.507102',
    status: 1,
    statusText: 'Inactive',
    createdOnDate: new Date('2022-07-21T11:36:45.507102'),
  },
  {
    id: 3,
    name: 'Reseller 2',
    email: 'reseller2@mail.com',
    contactName: null,
    description: 'description of reseller 2',
    address: 'address',
    city: 'City',
    state: 'State',
    postalCode: '652442',
    plan: 0,
    createdOn: '2022-07-25T11:36:45.507102',
    status: 1,
    statusText: 'Inactive',
    createdOnDate: new Date('2022-07-23T11:36:45.507102'),
  },
  {
    id: 4,
    name: 'Reseller 3',
    email: 'reseller3@mail.com',
    contactName: null,
    description: 'description',
    address: 'address',
    city: 'City',
    state: 'State',
    postalCode: '876456',
    plan: 0,
    createdOn: '2022-07-27T11:36:45.507102',
    status: 0,
    statusText: 'Active',
    createdOnDate: new Date('2022-07-23T11:36:45.507102'),
  },
  {
    id: 5,
    name: 'test',
    email: 'test@mail.com',
    contactName: null,
    description: 'description',
    address: 'address',
    city: 'City',
    state: 'State',
    postalCode: '652442',
    plan: 0,
    createdOn: '2022-07-27T11:36:45.507102',
    status: 0,
    statusText: 'Active',
    createdOnDate: new Date('2022-07-27T11:36:45.507102'),
  },
];

describe('ResellerPageComponent', () => {
  let component: ResellerPageComponent;
  let fixture: ComponentFixture<ResellerPageComponent>;
  let service: ResellerService;
  let messageService: MessageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResellerPageComponent],
      imports: [TableModule, HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [ResellerService, MessageService],
    }).compileComponents();

    fixture = TestBed.createComponent(ResellerPageComponent);
    component = fixture.debugElement.componentInstance;
    service = fixture.debugElement.injector.get(ResellerService);
    messageService = fixture.debugElement.injector.get(MessageService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit and get response as array with single element', fakeAsync(() => {
    let single = response.slice(0, 1);
    spyOn(service, 'getAll').withArgs([]);
    spyOn(service, 'onGetAll').and.callFake(() => {
      return of(single).pipe(delay(2000));
    });

    component.ngOnInit();
    tick(2000);
    expect(component.resellers).toEqual(single);
  }));

  it('should call ngOnInit and get response as array with multiple elements', fakeAsync(() => {
    spyOn(service, 'getAll').withArgs([]);
    spyOn(service, 'onGetAll').and.callFake(() => {
      return of(response).pipe(delay(2000));
    });
    component.ngOnInit();
    tick(2000);
    expect(component.resellers).toEqual(response);
  }));

  it('should display the same inactive resellers as response', () => {
    component.resellers = response;
    fixture.detectChanges();
    const inactives = component.resellers.filter((r) => r.status == ResellerStatus.Inactive).length;

    const element: HTMLElement = fixture.nativeElement;
    const td = Array.from(element.querySelectorAll('.status'));
    const tdInactives = td.filter((td) => td.textContent?.includes('Inactive'));

    expect(tdInactives.length).toEqual(inactives);
  });

  it('should display the same active resellers as response', () => {
    component.resellers = response;
    fixture.detectChanges();
    const actives = component.resellers.filter((r) => r.status == ResellerStatus.Active).length;

    const element: HTMLElement = fixture.nativeElement;
    const td = Array.from(element.querySelectorAll('.status'));
    const tdActives = td.filter((td) => td.textContent?.includes('Active'));

    expect(tdActives.length).toEqual(actives);
  });

  it('should call showPreview(reseller) when click reseller name', () => {
    spyOn(component, 'showPreview');
    component.resellers = response;
    fixture.detectChanges();

    const span = fixture.debugElement.queryAll(By.css('.name'))[0];
    span.triggerEventHandler('click', {});
    fixture.detectChanges();

    expect(component.showPreview).toHaveBeenCalled();
  });

  it('should select the firt reseller from response', () => {
    const selected = response[0];
    component.selectedId = selected.id;
    component.showPreview(selected);

    expect(component.selectedId).toEqual(selected.id);
  });

  it('should render reseller-add component', () => {
    component.showAdd = true;
    fixture.detectChanges();

    let resellerAddEl = fixture.debugElement.query(By.css('app-reseller-add'));

    expect(resellerAddEl).toBeTruthy();
  });

  it('should call resellerAdded($event) when add a reseller', () => {
    component.showAdd = true;
    fixture.detectChanges();

    let response: Response = { value: null, added: true };
    spyOn(component, 'resellerAdded');
    let resellerAddEl = fixture.debugElement.query(By.css('app-reseller-add'));
    resellerAddEl.triggerEventHandler('resellerAdded', response);
    fixture.detectChanges();

    expect(component.resellerAdded).toHaveBeenCalledWith(response);
  });

  it('should get success message when add a reseller', () => {
    let response: Response = { value: null, added: true };
    let expectedMessage: Message = {
      severity: 'success',
      summary: 'Global.Success',
      detail: 'Manager.ResellerAdd.ResellerAdded',
    };
    spyOn(messageService, 'add');
    spyOn(service, 'getAll');
    component.resellerAdded(response);

    expect(messageService.add).toHaveBeenCalledWith(expectedMessage);
    expect(service.getAll).toHaveBeenCalled();
  });

  it('should get error message when add a reseller', () => {
    let response: Response = { value: null, added: false, error: { error: { message: 'error to add reseller' } } };
    let expectedMessage: Message = {
      severity: 'error',
      summary: 'Global.Error',
      detail: response.error.error.message,
    };
    spyOn(messageService, 'add');
    component.resellerAdded(response);

    expect(messageService.add).toHaveBeenCalledWith(expectedMessage);
  });
});
