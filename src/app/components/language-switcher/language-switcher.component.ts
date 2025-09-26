import { Component, OnInit, HostListener } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class LanguageSwitcherComponent implements OnInit {
  availableLangs: string[] = [];
  activeLang: string;
  showDropdown = false;
  isMobile = false;

  constructor(private translocoService: TranslocoService) {
    this.activeLang = this.translocoService.getActiveLang();
    this.checkScreenSize();
  }

  ngOnInit(): void {
    this.availableLangs = this.translocoService.getAvailableLangs() as string[];
  }

  // Método para obtener las clases del dropdown según el dispositivo
  getDropdownClasses(): string {
    const baseClasses = 'absolute top-full mt-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-accent/20 overflow-hidden z-50 transition-all duration-300';
    const mobileClasses = this.isMobile ?
      'left-0 w-full' :
      'right-0 md:w-auto';

    const visibilityClasses = this.showDropdown ?
      'opacity-100 visible' :
      'opacity-0 invisible';

    return `${baseClasses} ${mobileClasses} ${visibilityClasses}`;
  }

  // Método para verificar el tamaño de pantalla
  checkScreenSize(): void {
    this.isMobile = window.innerWidth < 768;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkScreenSize();
    // Cerrar dropdown al cambiar de tamaño si es móvil
    if (this.isMobile && this.showDropdown) {
      this.showDropdown = false;
    }
  }

  // Resto de métodos existentes...
  getFlag(lang: string): string {
    const flags: { [key: string]: string } = {
      'de': '🇩🇪',
      'en': '🇺🇸',
      'es': '🇪🇸',
    };
    return flags[lang] || '🌐';
  }

  getFlagImage(lang: string): string {
    const flagImages: { [key: string]: string } = {
      'de': 'https://res.cloudinary.com/dvdscvipo/image/upload/v1758847711/flag-for-germany_bjrnij.svg',
      'en': 'https://res.cloudinary.com/dvdscvipo/image/upload/v1758847712/flag-for-united-states_ups9a2.svg',
      'es': 'https://res.cloudinary.com/dvdscvipo/image/upload/v1758847711/flag-for-spain_mktzn2.svg',
    };
    return flagImages[lang] || '/assets/flags/global.svg';
  }

  getLanguageName(lang: string): string {
    const names: { [key: string]: string } = {
      'de': 'Deutsch',
      'en': 'English',
      'es': 'Español'
    };
    return names[lang] || lang;
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  changeLang(lang: string): void {
    this.translocoService.setActiveLang(lang);
    this.activeLang = lang;
    this.showDropdown = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.language-switcher')) {
      this.showDropdown = false;
    }
  }
}
