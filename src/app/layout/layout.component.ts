import { Component, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { AuthService } from '../services/auth-service.service';
import { jwtDecode } from 'jwt-decode';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import Swal from 'sweetalert2';
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnDestroy {
  title = 'Centro de Universitario UNSM';
  currentRoute: string = '';
  isAuthenticated: boolean = false;
    isMobile = false;
  
  private routerEventsSubscription: Subscription;

  constructor(private router: Router, private authService: AuthService, private breakpointObserver: BreakpointObserver) {
    this.routerEventsSubscription = this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentRoute = event.urlAfterRedirects;
      this.checkAuthentication();
    });

    this.checkAuthentication();
        this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isMobile = result.matches;
      });
  }

  checkAuthentication() {
    this.isAuthenticated = this.authService.isAuthenticated();
  }

  isDashboardRoute(): boolean {
    return this.currentRoute.startsWith('/dashboard');
  }
/* hasPermission(requiredPermissions: string[]): boolean {
  const decoded = this.authService.decodeToken();
  if (!decoded || !decoded.permissions) return false;

  // Ahora `permissions` ya es un array de strings como ['ACCEDER']
  return requiredPermissions.some(req => decoded.permissions.includes(req));
} */

  toggleMenu() {
    document.getElementById('wrapper')?.classList.toggle('toggled');
  }

  logout() {
    Swal.fire({
      title: '¿Está seguro de cerrar sesión?',
      text: "Se cerrara sesión para el usuario?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout();
        this.router.navigate(['/login']);

      }
    });

  }

  ngOnDestroy() {
    if (this.routerEventsSubscription) {
      this.routerEventsSubscription.unsubscribe();
    }
  }

  login() {
    this.router.navigate(['/login']);
  }
  obtenerRole(){
    const role = this.authService.getUserRole();
    return role;
   }
obtenerName(): string {
  const info = this.authService.getUserInfo();
  return info && info.name ? info.name : 'Invitado';
}
hasRole(requiredRoles: string[]): boolean {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const decoded: any = jwtDecode(token);
    return requiredRoles.includes(decoded.role);
  } catch (e) {
    return false;
  }
}
hasPermission(requiredPermissions: string[]): boolean {
  const decoded = this.authService.decodeToken();
  if (!decoded || !decoded.permissions) return false;
  return requiredPermissions.some(req => decoded.permissions.includes(req));
}


}
