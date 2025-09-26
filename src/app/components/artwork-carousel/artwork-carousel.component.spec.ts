import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtworkCarouselComponent } from './artwork-carousel.component';

describe('ArtworkCarouselComponent', () => {
  let component: ArtworkCarouselComponent;
  let fixture: ComponentFixture<ArtworkCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtworkCarouselComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArtworkCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
