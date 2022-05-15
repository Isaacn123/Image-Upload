/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable object-shorthand */
import { Component } from '@angular/core';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { ImagePicker, ImagePickerOptions } from '@awesome-cordova-plugins/image-picker/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { ActionSheetController } from '@ionic/angular';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  imageurl: any;
  securepath: any = window;
  url: any;

  constructor(private actionsheet: ActionSheetController,
    private camera: Camera, private file: File,
    private imagepicker: ImagePicker, private crop: Crop, private domsanitize: DomSanitizer) {}


  chooseFromCamera(sourceType){
    const options: CameraOptions = {
       quality: 100,
       mediaType: this.camera.MediaType.PICTURE,
       destinationType: this.camera.DestinationType.FILE_URI,
       encodingType: this.camera.EncodingType.JPEG,
       sourceType: sourceType,
    };

    this.camera.getPicture(options).then((result) => {
      console.log('Camera URL',result);
      // this.imageurl = result;
      this.imageurl = this.securepath.Ionic.WebView.convertFileSrc(result);
    }, error=>{
      console.log('Error CAMERA', error);
    });
  }

  santizeUrl(imageUrl){
    return this.domsanitize.bypassSecurityTrustUrl(imageUrl);
  }

  pickImagesFromLibrary(){
    const options: ImagePickerOptions = {
      quality: 100,
      maximumImagesCount: 1,
    };
    this.imagepicker.getPictures(options).then((imageresult)=> {
    console.log('image Picker Results', imageresult);

     for(let i=0; i<imageresult.length; i++){
      this.url = this.securepath.Ionic.WebView.convertFileSrc(imageresult[i]);
     }
    }, rror=>{
      console.log('Image Picker Error:', rror);
    });
  }

 async selectimageOptions(){
    const actionsheet = await this.actionsheet.create({
     header: 'Select image Source',
     buttons: [
       {
         text: 'Load from Gallery',
         handler: ()=>{
           this.pickImagesFromLibrary();
           console.log('Image Selected from Gallery');
         }
       },
       {
         text: 'Select Camera',
         handler: ()=>{
           this.chooseFromCamera(this.camera.PictureSourceType.CAMERA);
           console.log('Camera Selected');
         }
       },
       {
         text: 'Cancel',
         role: 'cancel'
       }
     ]
    });
    await actionsheet.present();
  }


}
