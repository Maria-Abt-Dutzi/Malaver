// components/artist-bio/artist-bio.component.ts
import { Component } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-artist-bio',
  standalone: true,
  imports: [TranslocoModule, CommonModule, HeaderComponent],
  templateUrl: './artist-bio.component.html',
  styleUrls: ['./artist-bio.component.scss']
})
export class ArtistBioComponent {
  colombiaExhibitions = [
    'Museo de Arte Moderno, Bogotá',
    'Museo de la Independencia, Casa del Florero, Bogotá',
    'Museo de Arte Colonial, Bogotá',
    'Museo La Tertulia, Cali',
    'MULI Museo Libre de Arte Público de Cali, Cali'
  ];

  europeExhibitions = [
    'Castillo Neuburg an der Kamel',
    'Galería "Luer", Bad Wörishofen',
    'Galería en el Kurhaus, Bad Wörishofen',
    'Galería "Art Gladys", Club de Golf Bad Ragaz (Suiza)',
    'Galería "Kunsthalle Art-Schöch", Stein am Rhein (Suiza)'
  ];

  certificates = [
    {
      url: 'https://res.cloudinary.com/dku85ztg2/image/upload/v1768068253/0_kfv3jw.jpg',
      alt: 'Certificado 1'
    },
    {
      url: 'https://res.cloudinary.com/dku85ztg2/image/upload/v1768068259/0_kubwlc.jpg',
      alt: 'Certificado 2'
    }
  ];

  selectedCertificate: string | null = null;

  openCertificate(url: string): void {
    this.selectedCertificate = url;
  }

  closeCertificate(): void {
    this.selectedCertificate = null;
  }
}
