import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class VerificarCodigoGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    const username = localStorage.getItem('temp_user');

    if (username) {
      return true;
    }

    // Si no hay usuario en proceso de verificación, redirigir al login
    return this.router.createUrlTree(['/login']);
  }
}
