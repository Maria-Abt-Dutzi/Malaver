// services/artwork.service.ts
import { Injectable } from '@angular/core';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  Firestore,
  query,
  orderBy
} from '@angular/fire/firestore';
import { Artwork } from '../models/artwork.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ArtworkService {
  private artworks: Artwork[] = [];
  private artworksSubject = new BehaviorSubject<Artwork[]>([]);
  public artworks$ = this.artworksSubject.asObservable();

  constructor(private firestore: Firestore) {
    this.loadArtworks();
  }

  private loadArtworks(): void {
    try {
      const q = query(collection(this.firestore, 'Obras'), orderBy('titulo'));
      onSnapshot(q, (querySnapshot) => {
        const artworksData: Artwork[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as Artwork;
          artworksData.push({ ...data, id: doc.id });
        });
        this.artworks = artworksData;
        this.artworksSubject.next(artworksData);
      }, (error) => {
        console.error('Error loading artworks:', error);
        this.artworksSubject.next([]);
      });
    } catch (error) {
      console.error('Error setting up Firestore listener:', error);
      this.artworksSubject.next([]);
    }
  }

  getAllArtworks(): Observable<Artwork[]> {
    return this.artworks$;
  }

  getArtworksByCategory(category: string): Observable<Artwork[]> {
    return this.artworks$.pipe(
      map(artworks => {
        if (category === 'all') {
          return artworks;
        }
        return artworks.filter(artwork =>
          artwork.genero.toLowerCase() === category.toLowerCase()
        );
      })
    );
  }

  getArtworkById(id: string): Observable<Artwork | undefined> {
    return this.artworks$.pipe(
      map(artworks => artworks.find(artwork => artwork.id === id))
    );
  }

  async addArtwork(artwork: Artwork): Promise<string> {
    try {
      const { id, ...artworkWithoutId } = artwork;
      const docRef = await addDoc(collection(this.firestore, 'Obras'), artworkWithoutId);

      // No necesitamos actualizar el array local manualmente porque
      // onSnapshot se encargará de actualizarlo automáticamente
      return docRef.id;
    } catch (error) {
      console.error('Error adding artwork:', error);
      throw error; // Relanzamos el error para que el componente lo maneje
    }
  }

  async updateArtwork(updatedArtwork: Artwork): Promise<void> {
    try {
      const { id, ...artworkWithoutId } = updatedArtwork;
      const docRef = doc(this.firestore, 'Obras', id as string);
      await updateDoc(docRef, artworkWithoutId as any);

      // No necesitamos actualizar el array local manualmente
    } catch (error) {
      console.error('Error updating artwork:', error);
      throw error;
    }
  }

  async deleteArtwork(id: string): Promise<void> {
    try {
      await deleteDoc(doc(this.firestore, 'Obras', id));

      // No necesitamos actualizar el array local manualmente
    } catch (error) {
      console.error('Error deleting artwork:', error);
      throw error;
    }
  }
}
