import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';


@Injectable()
export class LoadingService {

    loading: any;

    constructor(public loadingCtrl: LoadingController) { }

    async present(text: string) : Promise<void> {
        this.loading = await this.loadingCtrl.create({
          spinner: 'bubbles',
          content: text
        });
    
        await this.loading.present();
      }

    async dismiss(): Promise<void> {
        await this.loading.dismiss();
    }
}
