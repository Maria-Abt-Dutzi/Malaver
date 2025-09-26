// app.routes.ts
import { Routes } from '@angular/router';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { ArtistBioComponent } from './components/artist-bio/artist-bio.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'admin/login', component: AdminLoginComponent },
  {
    path: 'admin/dashboard',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard]
  },
  { path: 'bio', component: ArtistBioComponent },

  { path: '**', redirectTo: '' }
];
