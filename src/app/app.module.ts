import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { TablaAgComponent } from './componentes/tabla-ag/tabla-ag.component';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './home/home.component';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AgGridModule } from 'ag-grid-angular';
import { VerificarCodigoComponent } from './auth/verificar-codigo/verificar-codigo.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Material Modules
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';

import { RegisterComponent } from './auth/register/register.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { RolComponent } from './rol/rol.component';
import { ModulosComponent } from './modulos/modulos.component';
import { CryptoDocumetComponent } from './crypto-documet/crypto-documet.component';
import { DigitalSignatureComponent } from './digital-signature/digital-signature.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ConfirmationDialogComponentComponent } from './confirmation-dialog-component/confirmation-dialog-component.component';
import { UploadFirmarComponent } from './upload-firmar/upload-firmar.component';
import { VerificarFirmasComponent } from './verificar-firmas/verificar-firmas.component';

import { AuthInterceptor } from './interceptor/auth.interceptor';

// 🔐 reCAPTCHA
import { RecaptchaModule } from 'ng-recaptcha';

// 🔑 Google Login
import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';

@NgModule({
  declarations: [
    AppComponent,
    TablaAgComponent,
    LoginComponent,
    HomeComponent,
    LayoutComponent,
    DashboardComponent,
    UsuariosComponent,
    VerificarCodigoComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    RolComponent,
    ModulosComponent,
    CryptoDocumetComponent,
    DigitalSignatureComponent,
    UserProfileComponent,
    ConfirmationDialogComponentComponent,
    UploadFirmarComponent,
    VerificarFirmasComponent,
  ],
  imports: [
    RouterModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AgGridModule,
    BrowserAnimationsModule,

    // Material
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatSelectModule,
    MatDialogModule,
    MatExpansionModule,

    // Extra
    RecaptchaModule,
    SocialLoginModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '208653476798-ag5f205v4ndok18qigvcqrgmaqp7sn86.apps.googleusercontent.com' // tu client ID
            ),
          },
        ],
        onError: (err: any) => {
          console.error('Google Login Error:', err);
        },
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
