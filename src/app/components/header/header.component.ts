import { Component, OnInit, OnDestroy, HostListener, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';
import { RouterModule, Router } from '@angular/router'; // Añadir Router
import { AuthService } from '../../services/auth.service';
import { ModalStateService } from '../../services/modal-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, LanguageSwitcherComponent, TranslocoModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @ViewChild('menuButton') menuButton!: ElementRef;
  @ViewChild('mobileMenu') mobileMenu!: ElementRef;
  isMenuOpen = false;
  isAuthenticated = false;
  isHeaderVisible = true;
  private authSubscription!: Subscription;
  private modalStateSubscription!: Subscription;

  constructor(
    private authService: AuthService,
    private modalStateService: ModalStateService,
    private router: Router // Inyectar Router
  ) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.authStatus$.subscribe(
      status => this.isAuthenticated = status
    );

    this.modalStateSubscription = this.modalStateService.isModalOpen$.subscribe(
      isModalOpen => {
        this.isHeaderVisible = !isModalOpen;
        if (isModalOpen && this.isMenuOpen) {
          this.isMenuOpen = false;
        }
      }
    );
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.modalStateSubscription) {
      this.modalStateSubscription.unsubscribe();
    }
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Nueva función para navegar y cerrar el menú
  navigateAndCloseMenu(fragment: string): void {
    this.isMenuOpen = false;

    // Navegar al fragmento después de un pequeño delay para permitir que el menú se cierre
    setTimeout(() => {
      this.router.navigate(['/'], { fragment: fragment }).then(() => {
        // Scroll suave al elemento después de la navegación
        this.scrollToFragment(fragment);
      });
    }, 100);
  }

  // Función para scroll suave al fragmento
  private scrollToFragment(fragment: string): void {
    const element = document.getElementById(fragment);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  logout(): void {
    this.authService.logout();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const isMobile = window.innerWidth < 768; // Tailwind's 'md' breakpoint

    if (this.isMenuOpen && isMobile && this.menuButton && this.mobileMenu) {
      const clickedInsideButton = this.menuButton.nativeElement.contains(target);
      const clickedInsideMenu = this.mobileMenu.nativeElement.contains(target);

      if (!clickedInsideButton && !clickedInsideMenu) {
        this.isMenuOpen = false;
      }
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscapeKey(event: KeyboardEvent) {
    if (this.isMenuOpen) {
      this.isMenuOpen = false;
    }
  }
}