import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistBioComponent } from './artist-bio.component';

describe('ArtistBioComponent', () => {
  let component: ArtistBioComponent;
  let fixture: ComponentFixture<ArtistBioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtistBioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArtistBioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
