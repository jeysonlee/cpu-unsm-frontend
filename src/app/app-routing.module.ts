import { Host, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { AuthGuard } from './guards/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { VerificarCodigoComponent } from './auth/verificar-codigo/verificar-codigo.component'; // Importa tu nuevo componente
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RedirectGuard } from './guards/redirect.guard';
import { VerificarCodigoGuard } from './guards/verificar-codigo.guard';
import { RegisterComponent } from './auth/register/register.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
//import { JwtInterceptor } from './interceptors/jwt.interceptor';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'welcome', component: HomeComponent },
  {path: 'forgot-password',component: ForgotPasswordComponent },
  {
    path: 'verificar-codigo',
    component: VerificarCodigoComponent,
    canActivate: [VerificarCodigoGuard] // si lo estás usando
  },
  { path: '', canActivate: [RedirectGuard], component: HomeComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'usuarios', component: UsuariosComponent }
    ]
  },
  { path: '**', canActivate: [RedirectGuard], component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
 /*    providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ], */
})
export class AppRoutingModule { }
