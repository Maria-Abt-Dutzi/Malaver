// components/admin-dashboard/admin-dashboard.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ArtworkService } from '../../services/artwork.service';
import { AuthService } from '../../services/auth.service';
import { Artwork } from '../../models/artwork.model';
import { Subscription } from 'rxjs';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule, TranslocoModule, HeaderComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  artworks: Artwork[] = [];
  newArtwork: Artwork = {
    id: '',
    titulo: '',
    medidas: '',
    tecnica: '',
    estilo: '',
    genero: '',
    descripcion: '',
    estado: '',
    precio: 0,
    moneda: 'EUR',
    imagen: '',
    anio: new Date().getFullYear(),
    categoria: '',
    vendido: false
  };
  editingArtwork: Artwork | null = null;
  successMessage: string = '';
  errorMessage: string = '';
  private subscription: Subscription = new Subscription();

  constructor(
    private artworkService: ArtworkService,
    public authService: AuthService,
    private translocoService: TranslocoService
  ) {}

  ngOnInit(): void {
    this.loadArtworks();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadArtworks(): void {
    this.subscription.add(
      this.artworkService.artworks$.subscribe({
        next: (artworks: Artwork[]) => {
          this.artworks = artworks;
        },
        error: (error: any) => {
          console.error('Error loading artworks:', error);
          this.errorMessage = this.translocoService.translate('adminDashboard.errors.load');
          setTimeout(() => {
            this.errorMessage = '';
          }, 3000);
        }
      })
    );
  }

  async onSubmit(): Promise<void> {
    try {
      if (this.editingArtwork) {
        // Modo edición
        await this.artworkService.updateArtwork({...this.newArtwork});
        this.successMessage = this.translocoService.translate('adminDashboard.success.update');
      } else {
        // Modo creación
        await this.artworkService.addArtwork({...this.newArtwork});
        this.successMessage = this.translocoService.translate('adminDashboard.success.add');
      }

      this.resetForm();

      // Limpiar mensaje después de 3 segundos
      setTimeout(() => {
        this.successMessage = '';
      }, 3000);
    } catch (error) {
      console.error('Error saving artwork:', error);
      this.errorMessage = this.translocoService.translate('adminDashboard.errors.save');
      setTimeout(() => {
        this.errorMessage = '';
      }, 3000);
    }
  }

  editArtwork(artwork: Artwork): void {
    this.editingArtwork = artwork;
    this.newArtwork = {...artwork};
  }

  async deleteArtwork(id: string): Promise<void> {
    if (confirm(this.translocoService.translate('adminDashboard.confirmDelete'))) {
      try {
        await this.artworkService.deleteArtwork(id);
        this.successMessage = this.translocoService.translate('adminDashboard.success.delete');
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      } catch (error) {
        console.error('Error deleting artwork:', error);
        this.errorMessage = this.translocoService.translate('adminDashboard.errors.delete');
        setTimeout(() => {
          this.errorMessage = '';
        }, 3000);
      }
    }
  }

  resetForm(): void {
    this.newArtwork = {
      id: '',
      titulo: '',
      medidas: '',
      tecnica: '',
      estilo: '',
      genero: '',
      descripcion: '',
      estado: '',
      precio: 0,
      moneda: 'EUR',
      imagen: '',
      anio: new Date().getFullYear(),
      categoria: '',
      vendido: false
    };
    this.editingArtwork = null;
  }

  cancelEdit(): void {
    this.resetForm();
  }
}
