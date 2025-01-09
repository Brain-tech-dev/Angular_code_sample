import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProfileService } from '@app/services/profile/profile.service';
import { PromotionsService } from '@app/services/reseller/promotions.service';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-add-promo-code',
  templateUrl: './add-promo-code.component.html',
  styleUrls: ['./add-promo-code.component.scss']
})
export class AddPromoCodeComponent implements OnInit {

  @Input() showDialog: boolean;
  @Input() promoCodeData: any;
  @Output() promoCodeAdded = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();
  @Input() isEditMode: boolean;
  private unsubscribe: Subject<void> = new Subject<void>();
  promoCodeForm: FormGroup;

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private promotionService: PromotionsService,
    private profileService: ProfileService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
      this.initializeForm();
      if (this.promoCodeData) {
        this.isEditMode = true;
        this.setFormForEdit();
      }
  }

  private initializeForm(): void {
    this.promoCodeForm = this.fb.group({
      name: ['', Validators.required],
      startDate: [new Date(), Validators.required],
      endDate: [new Date(), Validators.required],
      freeMonths: ['', [Validators.required, Validators.min(0)]],
      requests: ['', [Validators.required, Validators.min(0)]],
      freeBinder: [false],
      setupFee: [false],
    });
  }

  get formControls() {
    return this.promoCodeForm.controls;
  }

  private setFormForEdit(): void {
    if (this.promoCodeData) {
      this.promoCodeForm.patchValue({
        id: this.promoCodeData.id,
        name: this.promoCodeData.name,
        startDate: new Date(this.promoCodeData.startDate),
        endDate: new Date(this.promoCodeData.endDate),
        freeMonths: this.promoCodeData.freeMonths,
        requests: this.promoCodeData.requests,
        freeBinder: !!this.promoCodeData.freeBinder,
        setupFee: !!this.promoCodeData.setupFee,
        cycles: this.promoCodeData.cycles,
        status: this.promoCodeData.status
      });
  
      const fieldsToDisable = ['name', 'startDate', 'freeMonths', 'requests', 'freeBinder', 'setupFee'];
      fieldsToDisable.forEach(field => {
        this.promoCodeForm.get(field)?.disable();
      });
  
      this.promoCodeForm.get('endDate')?.enable();
    }
  }
  
  private adjustDateForTimezone(date: Date): string {
    const localOffset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - localOffset);
    return localDate.toISOString();
  }

  onSave(): void {
    if (this.promoCodeForm.valid) {
      let { startDate, endDate, freeBinder, setupFee, ...rest } = this.promoCodeForm.value;
      startDate = startDate ? this.adjustDateForTimezone(new Date(startDate)) : null;
      endDate = endDate ? this.adjustDateForTimezone(new Date(endDate)) : null;
      const resellerId = this.route.snapshot.params['id'];
      const promoData = {
        ...rest,
        freeBinder: freeBinder ? 1 : 0,
        setupFee: setupFee ? 1 : 0,
        startDate,
        endDate,
        resellerId,
      };
  
      const updatePromoData = {
        id: this.promoCodeData?.id,
        endDate,
        status: this.promoCodeData?.status,
      };
  
      const operation$ = this.isEditMode
        ? this.promotionService.updatePromotion(updatePromoData)
        : this.promotionService.addPromotion(promoData);
  
      operation$.subscribe({
        next: (response) => {
          this.promoCodeAdded.emit(response);
          this.showMessage('success', 'Promo Code saved successfully!');
        },
        error: (err) => {
          this.showMessage('error', `Error saving Promo Code: ${err.message}`);
        },
      });
    } else {
      this.markFormFieldsAsTouched();
    }
  }
  
  private markFormFieldsAsTouched(): void {
    Object.keys(this.promoCodeForm.controls).forEach((field) => {
      const control = this.promoCodeForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }
  
  private showMessage(severity: string, detail: string): void {
    this.messageService.add({
      severity,
      summary: severity === 'success' ? 'Success' : 'Error',
      detail,
    });
  }
  
  onCancel(): void {
    this.close.emit();
    if (this.isEditMode) {
      this.promoCodeForm.reset();
      this.isEditMode = false;
    } else {
      this.promoCodeForm.reset({
        name: this.promoCodeData?.name || '',
        startDate: this.promoCodeData?.startDate || new Date(),
        endDate: this.promoCodeData?.endDate || new Date(),
        freeMonths: this.promoCodeData?.freeMonths || 0,
        requests: this.promoCodeData?.requests || 0,
        cycles: this.promoCodeData?.cycles || 0
      });
    }
  }

}
