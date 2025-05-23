import { AlertController, ToastController } from '@ionic/angular';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private alertController: AlertController, private toastController: ToastController) { }

  async show(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
  
    await alert.present();
  }

  async showToast(message: string) {
    const alert = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top'
    });
  
    await alert.present();
  }

  async confirm(header: string, message: string): Promise<boolean> {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Yes'
        }
      ]
    });
  
    await alert.present();

    const { role } = await alert.onDidDismiss();

    if (role === 'cancel') {
      return false;
    }

    return true;
  }
}
