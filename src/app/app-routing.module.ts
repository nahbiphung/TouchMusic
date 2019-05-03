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

const routes: Routes = [
  { path: '', redirectTo: '/welcome', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'song/:name/:id', component: SongComponent},
  { path: 'playlist', component: PlaylistComponent},
  { path: 'admin', component: AdminComponent, children: [
    { path: 'user', component: UserComponent, children: [] },
    { path: 'song', component: AdminSongComponent }
  ]},
  { path : 'user-details', component: UserDetailsComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
