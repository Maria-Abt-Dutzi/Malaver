// components/artwork-carousel/artwork-carousel.component.ts
import { Component, Input, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Artwork } from '../../models/artwork.model';
import { Subscription } from 'rxjs';
import { ModalStateService } from '../../services/modal-state.service';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-artwork-carousel',
  standalone: true,
  imports: [CommonModule, TranslocoModule],
  templateUrl: './artwork-carousel.component.html',
  styleUrls: ['./artwork-carousel.component.scss']
})
export class ArtworkCarouselComponent implements OnInit {
  @Input() artworks: Artwork[] = [];

  currentIndex: number = 0;
  currentArtwork: Artwork | null = null;
  isModalOpen: boolean = false;
  isZoomed: boolean = false;
  showZoomIndicator: boolean = false;

  // Índices para las tarjetas adyacentes
  left2Index: number = 0;
  left1Index: number = 0;
  right1Index: number = 0;
  right2Index: number = 0;
  isMobile: boolean = false;

  // --- START: Properties for panning ---
  isPanning: boolean = false;
  wasPanning: boolean = false; // To differentiate pan from click
  startX: number = 0;
  startY: number = 0;
  translateX: number = 0;
  translateY: number = 0;
  // --- END: Properties for panning ---

    private modalStateSubscription: Subscription;

  constructor(
    private modalStateService: ModalStateService,
    private translocoService: TranslocoService
    ) {
    // Suscribirse a cambios en el estado del modal
    this.modalStateSubscription = this.modalStateService.isModalOpen$.subscribe(
      isOpen => {
        // Sincronizar el estado local con el servicio
        if (isOpen !== this.isModalOpen) {
          this.isModalOpen = isOpen;
        }
      }
    );
  }

  ngOnInit() {
    this.updateCarousel(0);
    this.checkIfMobile();
    window.addEventListener('resize', () => this.checkIfMobile());
  }

  ngOnChanges() {
    if (this.artworks.length > 0) {
      this.updateCarousel(this.currentIndex);
    }
  }


  ngOnDestroy() {
    if (this.modalStateSubscription) {
      this.modalStateSubscription.unsubscribe();
    }
    window.removeEventListener('resize', () => this.checkIfMobile());
  }

  updateCarousel(newIndex: number) {
    const total = this.artworks.length;
    this.currentIndex = (newIndex + total) % total;
    this.currentArtwork = this.artworks[this.currentIndex];
    this.resetZoomAndPan(); // Reset zoom and pan when image changes

    // Calcular índices adyacentes
    this.left2Index = (this.currentIndex - 2 + total) % total;
    this.left1Index = (this.currentIndex - 1 + total) % total;
    this.right1Index = (this.currentIndex + 1) % total;
    this.right2Index = (this.currentIndex + 2) % total;
  }

  isHidden(index: number): boolean {
    const total = this.artworks.length;
    const positions = [
      this.currentIndex,
      this.left1Index,
      this.left2Index,
      this.right1Index,
      this.right2Index
    ];
    return !positions.includes(index);
  }

  next() {
    this.updateCarousel(this.currentIndex + 1);
  }

  prev() {
    this.updateCarousel(this.currentIndex - 1);
  }

  goToSlide(index: number) {
    this.updateCarousel(index);
  }

  // Modal methods
  openModal() {
    this.isModalOpen = true;
    this.modalStateService.openModal(); // Notificar al servicio
    this.resetZoomAndPan();
    document.body.style.overflow = 'hidden';
  }
    closeModal() {
    this.isModalOpen = false;
    this.modalStateService.closeModal(); // Notificar al servicio
    this.resetZoomAndPan();
    document.body.style.overflow = '';
  }


  // Navegación dentro del modal
  nextInModal() {
    this.next();
  }

  prevInModal() {
    this.prev();
  }

  // --- START: Zoom and Pan Logic ---

  resetZoomAndPan() {
    this.isZoomed = false;
    this.isPanning = false;
    this.wasPanning = false;
    this.translateX = 0;
    this.translateY = 0;
  }

  toggleZoom(event: MouseEvent | TouchEvent) {
    if (this.wasPanning) {
      this.wasPanning = false;
      return;
    }

    this.isZoomed = !this.isZoomed;
    this.translateX = 0;
    this.translateY = 0;

    if (this.isZoomed) {
      this.showZoomIndicator = true;
      setTimeout(() => {
        this.showZoomIndicator = false;
      }, 3000);
    }
  }

  onPanStart(event: MouseEvent | TouchEvent) {
    if (!this.isZoomed) return;
    this.isPanning = true;
    const point = 'touches' in event ? event.touches[0] : event;
    this.startX = point.clientX - this.translateX;
    this.startY = point.clientY - this.translateY;
  }

  onPanMove(event: MouseEvent | TouchEvent) {
    if (!this.isPanning || !this.isZoomed) return;
    event.preventDefault();
    this.wasPanning = true;
    const point = 'touches' in event ? event.touches[0] : event;
    this.translateX = point.clientX - this.startX;
    this.translateY = point.clientY - this.startY;
  }

  onPanEnd(event: MouseEvent | TouchEvent) {
    if (!this.isPanning) return;
    this.isPanning = false;
  }

  getImageTransform(): string {
    if (!this.isZoomed) {
      return 'scale(1)';
    }
    const scale = this.isMobile ? 2.5 : 1.8;
    return `scale(${scale}) translate(${this.translateX}px, ${this.translateY}px)`;
  }
  // --- END: Zoom and Pan Logic ---


  // Cerrar modal con ESC key
  @HostListener('document:keydown.escape', ['$event'])
  handleEscapeKey(event: KeyboardEvent) {
    if (this.isModalOpen) {
      if (this.isZoomed) {
        this.resetZoomAndPan(); // Quitar zoom y resetear pan
      } else {
        this.closeModal();
      }
    }
  }

  @HostListener('document:keydown.arrowright', ['$event'])
  handleRightArrow(event: KeyboardEvent) {
    if (this.isModalOpen && !this.isZoomed) {
      this.nextInModal();
    }
  }

  @HostListener('document:keydown.arrowleft', ['$event'])
  handleLeftArrow(event: KeyboardEvent) {
    if (this.isModalOpen && !this.isZoomed) {
      this.prevInModal();
    }
  }

  @HostListener('document:keydown.z', ['$event'])
  handleZKey(event: KeyboardEvent) {
    if (this.isModalOpen) {
      this.toggleZoom(new MouseEvent('click'));
    }
  }

  checkIfMobile() {
    this.isMobile = window.innerWidth <= 768;
  }
}