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
}
