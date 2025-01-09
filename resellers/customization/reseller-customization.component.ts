import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ResellerService } from '@app/services/reseller/reseller.service';
import { MessageService } from 'primeng/api';
import { Reseller, ResellerSettings } from '@app/services/models';
import { FileService } from '@app/pages/admin/batches/services/file.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FileUpload } from 'primeng/fileupload';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-reseller-customization',
  templateUrl: './reseller-customization.component.html',
  providers: [ResellerService, MessageService, FileService]
})
export class ResellerCustomizationComponent implements OnInit, OnDestroy {

  @Output() saveChanges = new EventEmitter<Reseller>();
  @ViewChild('logoFileUpload', { static: false }) topLogoFileUpload: FileUpload;
  @ViewChild('sslogoFileUpload', { static: false }) ssLogoFileUpload: FileUpload;
  @ViewChild('naviIconUpload', { static: false }) naviLogoFileUpload: FileUpload;

  vm: ViewModel = new ViewModel();

  @Input()
  set reseller(value: Reseller) {
    this.vm.reseller = value;
  }

  get reseller(): Reseller {
    return this.vm.reseller;
  }

  constructor(private fileUpload: FileService, private sanitizer: DomSanitizer) {
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.setValues();
  }

  setValues() {
    this.setDefaultLogo();
    this.setDefaultSSLogo();
    this.setDefaultNavi();
    this.setDefaultBrandName();
  }

  setDefaultLogo() {

    if(!this.reseller.settings){
      return;
    }

    this.vm.currentLogoUrl = this.reseller.settings?.find(p => p.key == 'Logo')?.value;
    if (this.vm.currentLogoUrl) {
      this.vm.originalSettingLogo = this.reseller.settings.find(p => p.key == 'Logo');
    }
  }

  setDefaultSSLogo() {

    if (!this.reseller.settings) {
      return;
    }

    this.vm.currentSSLogoUrl = this.reseller.settings?.find(p => p.key == 'SSLogo')?.value;
    if (this.vm.currentSSLogoUrl) {
      this.vm.originalSettingSSLogo = this.reseller.settings.find(p => p.key == 'SSLogo');
    }
  }

  setDefaultNavi() {
    this.vm.currentLogoNaviIconUrl = this.reseller.settings?.find(p => p.key == 'Icon')?.value;
    if (this.vm.currentLogoNaviIconUrl) {
      this.vm.originalSettingIcon = this.reseller.settings?.find(p => p.key == 'Icon');
    }
  }

  setDefaultBrandName() {
    this.vm.brandName = this.reseller.settings?.find(p => p.key == 'BrandName')?.value;
    if (!this.vm.brandName) {
      this.vm.brandName = this.reseller.name;
    }
  }

  onTopLogoSelect($event: any) {
    const fileUrl = URL.createObjectURL($event.currentFiles[0]);
    this.vm.currentLogoFile = this.sanitizer.bypassSecurityTrustUrl(fileUrl);
    this.vm.hasLogoChanged = true;
  }
  onSSLogoSelect($event: any) {
    const fileUrl = URL.createObjectURL($event.currentFiles[0]);
    this.vm.currentSSLogoFile = this.sanitizer.bypassSecurityTrustUrl(fileUrl);
    this.vm.hasSSLogoChanged = true;
  }
  onResetLogo() {
    this.topLogoFileUpload.clear();
    this.vm.currentLogoFile = null;

    if (this.vm.originalSettingLogo) {
      this.reseller.settings?.push(this.vm.originalSettingLogo);
    }

    this.vm.hasLogoChanged = false;
    this.setDefaultLogo();
  }
  onResetSSLogo() {
    this.ssLogoFileUpload.clear();
    this.vm.currentSSLogoFile = null;

    if (this.vm.originalSettingSSLogo) {
      this.reseller.settings?.push(this.vm.originalSettingSSLogo);
    }

    this.vm.hasSSLogoChanged = false;
    this.setDefaultSSLogo();
  }
  onRemoveLogo() {
    this.vm.currentLogoFile = null;
    this.vm.currentLogoUrl = '';
    this.reseller.settings = this.reseller.settings?.filter(p => p.key != 'Logo');
    this.topLogoFileUpload.clear();
    this.vm.hasLogoChanged = true;
  }
  onRemoveSSLogo() {
    this.vm.currentSSLogoFile = null;
    this.vm.currentSSLogoUrl = '';
    this.reseller.settings = this.reseller.settings?.filter(p => p.key != 'SSLogo');
    this.ssLogoFileUpload.clear();
    this.vm.hasSSLogoChanged = true;
  }
  onNaviIconSelect($event: any) {
    console.log("Logo Selected", $event);
    const fileUrl = URL.createObjectURL($event.currentFiles[0]);
    this.vm.currentLogoNaviIconFile = this.sanitizer.bypassSecurityTrustUrl(fileUrl);
    this.vm.hasIconChanged = true;
  }

  onResetNaviIcon() {
    this.naviLogoFileUpload.clear();
    this.vm.currentLogoNaviIconFile = null;

    if (this.vm.originalSettingIcon) {
      this.reseller.settings?.push(this.vm.originalSettingIcon);
    }
    this.vm.hasIconChanged = false;
    this.setDefaultNavi();
  }

  onRemoveNaviIcon() {
    this.vm.currentLogoNaviIconFile = null;
    this.vm.currentLogoNaviIconUrl = '';
    this.reseller.settings = this.reseller.settings?.filter(p => p.key != 'Icon');
    this.topLogoFileUpload.clear();
    this.vm.hasIconChanged = true;
  }

  async onSave() {

    if(this.vm.hasLogoChanged) {
      if(this.topLogoFileUpload.files.length > 0) {
        let result = await lastValueFrom(this.fileUpload.uploadFile(this.topLogoFileUpload.files[0]));
        let fileName = this.fileUpload.linkForFile(result);
        let metadataObs = this.fileUpload.setMetaData(result.id, { 'resellerLogo': `${result.id}` })
        await lastValueFrom(metadataObs);
        this.vm.originalSettingLogo = this.reseller.settings?.find(p => p.key == 'Logo');
        if(this.vm.originalSettingLogo){
          this.vm.originalSettingLogo.value = fileName;
        }else{
          let logoSetting : ResellerSettings ={key: 'Logo', value: fileName, settingType: 0};
          this.vm.reseller.settings?.push(logoSetting);
        }
      }else{
        this.vm.reseller.settings = this.vm.reseller.settings?.filter(p => p.key != 'Logo');
      }
    }

    if (this.vm.hasSSLogoChanged) {
      if (this.ssLogoFileUpload.files.length > 0) {
        let result = await lastValueFrom(this.fileUpload.uploadFile(this.ssLogoFileUpload.files[0]));
        let fileName = this.fileUpload.linkForFile(result);
        let metadataObs = this.fileUpload.setMetaData(result.id, { 'resellerSSLogo': `${result.id}` })
        await lastValueFrom(metadataObs);
        this.vm.originalSettingSSLogo = this.reseller.settings?.find(p => p.key == 'SSLogo');
        if (this.vm.originalSettingSSLogo) {
          this.vm.originalSettingSSLogo.value = fileName;
        } else {
          let logoSetting: ResellerSettings = { key: 'SSLogo', value: fileName, settingType: 0 };
          this.vm.reseller.settings?.push(logoSetting);
        }
      } else {
        this.vm.reseller.settings = this.vm.reseller.settings?.filter(p => p.key != 'SSLogo');
      }
    }

    if (this.vm.hasIconChanged) {
      if(this.naviLogoFileUpload.files.length > 0){
        let result = await lastValueFrom(this.fileUpload.uploadFile(this.naviLogoFileUpload.files[0]));
        let fileName = this.fileUpload.linkForFile(result);

        let metadataObs = this.fileUpload.setMetaData(result.id, { 'resellerIcon': `${result.id}` })
        await lastValueFrom(metadataObs);

        this.vm.originalSettingIcon = this.reseller.settings?.find(p => p.key == 'Icon');
        if(this.vm.originalSettingIcon){
          this.vm.originalSettingIcon.value = fileName;
        }else{
          let logoSetting : ResellerSettings ={key: 'Icon', value: fileName, settingType: 0};
          this.vm.reseller.settings?.push(logoSetting);
        }
      }else{
        this.vm.reseller.settings = this.vm.reseller.settings?.filter(p => p.key != 'Icon');
      }


    }

    let branName = this.reseller.settings?.find(p => p.key == 'BrandName');

    if(branName){
      branName.value = this.vm.brandName;
    }else{
      let brandSetting : ResellerSettings ={key: 'BrandName', value: this.vm.brandName, settingType: 0};
      this.vm.reseller.settings?.push(brandSetting);
    }

    this.saveChanges.emit(this.vm.reseller);
  }

  onCancel() {
    this.onResetLogo()
    this.onResetNaviIcon();
    this.setDefaultBrandName();
  }
}

class ViewModel{
  reseller: Reseller;
  currentLogoUrl : string;
  currentLogoFile: any = null;
  currentSSLogoUrl: string;
  currentSSLogoFile: any = null;
  currentLogoNaviIconUrl:string;
  currentLogoNaviIconFile:any = null;
  originalSettingLogo: ResellerSettings | undefined;
  originalSettingSSLogo: ResellerSettings | undefined;
  originalSettingIcon: any;
  hasLogoChanged: boolean = false;
  hasSSLogoChanged: boolean = false;
  hasIconChanged: boolean = false;
  brandName: string;
}
