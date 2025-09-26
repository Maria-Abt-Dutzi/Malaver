import { AfterViewInit, Component, ElementRef, HostListener, Input, OnDestroy } from '@angular/core';
import { Artwork } from '../../models/artwork.model';

@Component({
  selector: 'app-gallery3d',
  standalone: true,
  imports: [],
  templateUrl: './gallery3d.component.html',
  styleUrl: './gallery3d.component.scss'
})
export class Gallery3dComponent implements AfterViewInit, OnDestroy {
  @Input() artworks: Artwork[] = [];
  @Input() category: string = 'all';

  private spinContainer!: HTMLElement;
  private dragContainer!: HTMLElement;
  private ground!: HTMLElement;
  private radius = 240;
  private autoRotate = true;
  private rotateSpeed = -60;
  private imgWidth = 120;
  private imgHeight = 170;

  private sX: number = 0;
  private sY: number = 0;
  private nX: number = 0;
  private nY: number = 0;
  private desX: number = 0;
  private desY: number = 0;
  private tX: number = 0;
  private tY: number = 10;
  private timer: any = null;

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit(): void {
    this.initGallery();
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  private initGallery(): void {
    this.spinContainer = this.elementRef.nativeElement.querySelector('.spin-container');
    this.dragContainer = this.elementRef.nativeElement.querySelector('.drag-container');
    this.ground = this.elementRef.nativeElement.querySelector('.ground');

    if (!this.spinContainer || this.artworks.length === 0) return;

    // Configurar dimensiones
    this.spinContainer.style.width = `${this.imgWidth}px`;
    this.spinContainer.style.height = `${this.imgHeight}px`;

    // Limpiar contenedor
    this.spinContainer.innerHTML = '';

    // Crear elementos de imagen
    this.artworks.forEach((artwork, i) => {
      const img = document.createElement('img');
      img.src = artwork.imagen;
      img.alt = artwork.titulo;
      img.dataset['id'] = artwork.id.toString();
      img.style.transform = `rotateY(${i * (360 / this.artworks.length)}deg) translateZ(${this.radius}px)`;
      img.style.transition = 'transform 1s';
      img.style.transitionDelay = `${i / this.artworks.length}s`;
      this.spinContainer.appendChild(img);
    });

    // Configurar suelo
    this.ground.style.width = `${this.radius * 3}px`;
    this.ground.style.height = `${this.radius * 3}px`;

    // Iniciar animación
    this.initCarousel();
  }

  private initCarousel(): void {
    if (this.autoRotate) {
      const animationName = this.rotateSpeed > 0 ? 'spin' : 'spinRevert';
      this.spinContainer.style.animation = `${animationName} ${Math.abs(this.rotateSpeed)}s infinite linear`;
    }

    this.setupDragEvents();
  }

  private setupDragEvents(): void {
    const applyTransform = (obj: HTMLElement) => {
      if (this.tY > 180) this.tY = 180;
      if (this.tY < 0) this.tY = 0;

      obj.style.transform = `rotateX(${-this.tY}deg) rotateY(${this.tX}deg)`;
    };

    const playSpin = (yes: boolean) => {
      this.spinContainer.style.animationPlayState = yes ? 'running' : 'paused';
    };

    this.dragContainer.onpointerdown = (e) => {
      clearInterval(this.timer);
      this.sX = e.clientX;
      this.sY = e.clientY;

      this.dragContainer.onpointermove = (e) => {
        this.nX = e.clientX;
        this.nY = e.clientY;
        this.desX = this.nX - this.sX;
        this.desY = this.nY - this.sY;
        this.tX += this.desX * 0.1;
        this.tY += this.desY * 0.1;
        applyTransform(this.dragContainer);
        this.sX = this.nX;
        this.sY = this.nY;
      };

      this.dragContainer.onpointerup = () => {
        this.timer = setInterval(() => {
          this.desX *= 0.95;
          this.desY *= 0.95;
          this.tX += this.desX * 0.1;
          this.tY += this.desY * 0.1;
          applyTransform(this.dragContainer);
          playSpin(false);

          if (Math.abs(this.desX) < 0.5 && Math.abs(this.desY) < 0.5) {
            clearInterval(this.timer);
            playSpin(true);
          }
        }, 17);

        this.dragContainer.onpointermove = this.dragContainer.onpointerup = null;
      };

      return false;
    };
  }

  @HostListener('window:resize')
  onResize() {
    this.initGallery();
  }
}
