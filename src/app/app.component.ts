import { Component } from '@angular/core';
import { Share } from '@capacitor/share';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor() {}

  async share() {
    await Share.share({
      title: "Quotable",
      text: "Wise sayings",
      url: environment.siteUrl
    });
  }
}
