import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Modules
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { SlideshowModule } from 'ng-simple-slideshow';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

// Material Module
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule} from '@angular/material/grid-list';
import { MatCheckboxModule } from '@angular/material/checkbox';
// FireBase Module
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule, FirestoreSettingsToken } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
// Services
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';

// Components
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { NavPlayerComponent } from './components/nav-player/nav-player.component';
import { HomeComponent } from './components/home/home.component';


import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatSliderModule } from '@angular/material/slider';
import { SongComponent } from './components/song/song.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UiLoadingComponent } from './ui-loading/ui-loading.component';
import { PlaylistComponent } from './components/playlist/playlist.component';
import { AdminComponent } from './components/admin/admin/admin.component';
import { UserComponent } from './components/admin/user/user.component';
import { AdminSongComponent } from './components/admin/admin-song/admin-song.component';
import { UserDetailsComponent } from './components/admin/user-details/user-details.component';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    LoginComponent,
    SignUpComponent,
    WelcomeComponent,
    PageNotFoundComponent,
    NavPlayerComponent,
    SongComponent,
    HomeComponent,
    UiLoadingComponent,
    PlaylistComponent,
    AdminComponent,
    UserComponent,
    AdminSongComponent,
    UserDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-bottom-left',
      maxOpened: 5,
      preventDuplicates: true
    }),
    BrowserAnimationsModule,
    SlideshowModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatDatepickerModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebase),
    HttpClientModule,
    HttpModule,
    MatProgressBarModule,
    DragDropModule,
    MatSliderModule,
    MDBBootstrapModule.forRoot(),
    MatProgressSpinnerModule,
    SlickCarouselModule,
    MatPaginatorModule,
    MatSidenavModule,
    MatTableModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatGridListModule,
    MatCheckboxModule,
    AngularFireStorageModule
  ],
  providers: [AuthService, UserService, { provide: FirestoreSettingsToken, useValue: {} }],
  bootstrap: [AppComponent],
  entryComponents: []
})
export class AppModule { }
