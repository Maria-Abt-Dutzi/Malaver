// app.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { HeroComponent } from './components/hero/hero.component';
import { TechniquesComponent } from './components/techniques/techniques.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { FooterComponent } from './components/footer/footer.component';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { AvaliableLanguages } from './utils/translate/transloco-config';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    HeroComponent,
    TechniquesComponent,
    GalleryComponent,
    FooterComponent,
    TranslocoModule

  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  isLoading = true;
  private transloco = inject(TranslocoService);

  public languages: { code: AvaliableLanguages; name: string }[] = [
    { code: AvaliableLanguages.ES, name: 'languages.es' },
    { code: AvaliableLanguages.EN, name: 'languages.en' },
    { code: AvaliableLanguages.DE, name: 'languages.de' },
  ];

  ngOnInit() {
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }

  public changeLang(lang: AvaliableLanguages) {
    this.transloco.setActiveLang(lang);
  }

  public getLanguage() {
    return 'languages.' + this.transloco.getActiveLang();
  }
  title = 'Malaver';
}