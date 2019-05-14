import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { SongComponent } from './components/song/song.component';
import { HomeComponent } from './components/home/home.component';
import { PlaylistComponent } from './components/playlist/playlist.component';
import { AdminComponent } from './components/admin/admin/admin.component';
import { UserComponent } from './components/admin/user/user.component';
import { AdminSongComponent } from './components/admin/admin-song/admin-song.component';
import { UserDetailsComponent } from './components/admin/user-details/user-details.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PerformerComponent } from './components/performer/performer.component';
import { CountryComponent } from './components/admin/country/country.component';

const routes: Routes = [
  { path: '', redirectTo: '/welcome', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'song/:name/:id', component: SongComponent},
  { path: 'admin', component: AdminComponent, children: [
    { path: 'user', component: UserComponent, children: [] },
    { path: 'song', component: AdminSongComponent },
    { path: 'country', component: CountryComponent }
  ]},
  { path: 'playlist/album/:id', component: PlaylistComponent},
  { path: 'playlist/favoritePlaylist/:id', component: PlaylistComponent},
  { path: 'playlist/country/:id', component: PlaylistComponent},
  { path: 'profile/:uid', component: ProfileComponent},
  { path: 'performer/:id', component: PerformerComponent},
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
