import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-verificar-codigo',
  templateUrl: './verificar-codigo.component.html',
  styleUrls: ['./verificar-codigo.component.css']
})
export class VerificarCodigoComponent implements OnDestroy {
  code: string = '';
  username: string = '';

  minutes: number = 1;
  seconds: number = 59;
  expired: boolean = false;
  isLoading: boolean = false;

  private timer: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.username = this.route.snapshot.queryParamMap.get('username') || '';

    if (!this.username) {
      Swal.fire('Error', 'No se pudo recuperar el usuario para verificación.', 'error').then(() => {
        this.router.navigate(['/login']);
      });
    }

    this.startCountdown();
  }

  startCountdown() {
    this.timer = setInterval(() => {
      if (this.seconds > 0) {
        this.seconds--;
      } else if (this.minutes > 0) {
        this.minutes--;
        this.seconds = 59;
      } else {
        this.expired = true;
        clearInterval(this.timer);
      }
    }, 1000);
  }

verifyCode() {
  if (this.expired || this.isLoading) return;

  this.isLoading = true;

  this.authService.verify2fa(this.username, this.code).subscribe(
    res => {
      this.authService.setToken(res.jwt);
      localStorage.removeItem('temp_user');
      this.isLoading = false;

      Swal.fire('Bienvenido', 'Código verificado correctamente', 'success').then(() => {
        this.router.navigate(['/dashboard']);
      });
    },
    () => {
      this.isLoading = false;
      Swal.fire('Error', 'Código inválido o expirado', 'error');
    }
  );
}

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }
}
