// components/gallery/gallery.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArtworkCarouselComponent } from '../artwork-carousel/artwork-carousel.component';
import { ArtworkService } from '../../services/artwork.service';
import { Artwork } from '../../models/artwork.model';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, ArtworkCarouselComponent, FormsModule, TranslocoModule],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit, OnDestroy {
  artworks: Artwork[] = [];
  filteredArtworks: Artwork[] = [];
  isLoading: boolean = true;

  availableCategories: string[] = ['todas', 'paisajismo', 'bodegones', 'retratos', 'animalismo', 'otros'];
  selectedCategory: string = 'todas';
  searchTerm: string = '';

  private subscription: Subscription = new Subscription();

  constructor(private artworkService: ArtworkService, private translocoService: TranslocoService) {}

  ngOnInit(): void {
    this.loadArtworks();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadArtworks(): void {
    this.isLoading = true;
    this.subscription.add(
      this.artworkService.getAllArtworks().subscribe({
        next: (artworks: Artwork[]) => {
          this.artworks = artworks;
          this.applyFilters();
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Error loading artworks:', error);
          this.isLoading = false;
        }
      })
    );
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.applyFilters();
  }

  getCategoryButtonClass(category: string): string {
    const baseClasses = "px-3 lg:px-6 py-2 lg:py-3 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 whitespace-nowrap";

    if (this.selectedCategory === category) {
      return `${baseClasses} bg-primary text-white shadow-lg transform hover:scale-105 border border-primary`;
    } else {
      return `${baseClasses} bg-white/80 backdrop-blur-sm text-primary-dark border border-accent hover:bg-primary/10 hover:border-primary/30 hover:shadow-md`;
    }
  }

  getCategoryDisplayName(category: string): string {
    return this.translocoService.translate(`gallery.categories.${category}`);
  }

  applyFilters(): void {
    let filtered = this.artworks;

    // Filtrar por categoría seleccionada
    if (this.selectedCategory !== 'todas') {
      filtered = filtered.filter(artwork =>
        artwork.categoria.toLowerCase() === this.selectedCategory
      );
    }

    // Filtrar por término de búsqueda
    if (this.searchTerm.trim() !== '') {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(artwork =>
        artwork.titulo.toLowerCase().includes(term) ||
        (artwork.descripcion && artwork.descripcion.toLowerCase().includes(term)) ||
        artwork.tecnica.toLowerCase().includes(term)
      );
    }

    this.filteredArtworks = filtered;
  }

  clearFilters(): void {
    this.selectedCategory = 'todas';
    this.searchTerm = '';
    this.applyFilters();
  }

  // Método para limpiar búsqueda individual
  clearSearch(): void {
    this.searchTerm = '';
    this.applyFilters();
  }
}
