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
import { HttpClientModule } from '@angular/common/http';
import { AgGridModule } from 'ag-grid-angular';
import { VerificarCodigoComponent } from './auth/verificar-codigo/verificar-codigo.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


// Material Modules
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule, MatIconAnchor, MatIconButton } from '@angular/material/button';
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
import { RegisterComponent } from './auth/register/register.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { RolComponent } from './rol/rol.component';
import { ModulosComponent } from './modulos/modulos.component';


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
  ],
  imports: [

    RouterModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule, // Agrega HttpClientModule aquí
    ReactiveFormsModule,
    //BrowserAnimationsModule, // Necesario para la animación del spinner
    //NgxSpinnerModule,
    AgGridModule,
    BrowserAnimationsModule, // Agrega AgGridModule aquí
       // Angular Material
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatSelectModule,
    MatDialogModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
