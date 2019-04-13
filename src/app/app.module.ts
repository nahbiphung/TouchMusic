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

// Material Module
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';

// FireBase Module
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule, FirestoreSettingsToken } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';

// Components
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { NavPlayerComponent } from './components/nav-player/nav-player.component';
import { HomeComponent } from './components/home/home.component';
import { AuthService } from './services/auth.service';

import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatSliderModule} from '@angular/material/slider';
import { SongComponent } from './components/song/song.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { UiLoadingComponent } from './ui-loading/ui-loading.component';
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
    UiLoadingComponent
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
    MatProgressSpinnerModule
  ],
  providers: [AuthService, { provide: FirestoreSettingsToken, useValue: {} }],
  bootstrap: [AppComponent]
})
export class AppModule { }
