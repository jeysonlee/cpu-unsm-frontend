import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  step: 'email' | 'code' | 'reset' = 'email';
  email: string = '';
  code: string = '';

  form: FormGroup;
  isLoading = false;
  errorMsg = '';

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group({
      password: ['', [
        Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#+_.-])[A-Za-z\d@$!%*?&#+_.-]{8,}$/)
      ]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordsMatch });
  }

  // Paso 1: Enviar código al correo
  sendCode() {
    this.isLoading = true;
    this.authService.requestPasswordReset(this.email).subscribe({
      next: () => {
        this.step = 'code';
        this.errorMsg = '';
        this.isLoading = false;
      },
      error: err => {
        this.errorMsg = 'El correo no está registrado.';
        this.isLoading = false;
      }
    });
  }

  // Paso 2: Validar código
  validateCode() {
    this.isLoading = true;
    this.authService.validateResetCode(this.email, this.code).subscribe({
      next: () => {
        this.step = 'reset';
        this.errorMsg = '';
        this.isLoading = false;
      },
      error: err => {
        this.errorMsg = 'Código incorrecto o expirado.';
        this.isLoading = false;
      }
    });
  }

  // Paso 3: Cambiar la contraseña
  changePassword() {
    if (this.form.invalid) return;

    const newPassword = this.form.get('password')?.value;
    this.isLoading = true;

    this.authService.updatePassword(this.email,  newPassword).subscribe({
      next: () => {
        alert('Contraseña actualizada. Inicia sesión con la nueva contraseña.');
        this.router.navigate(['/login']);
      },
      error: err => {
        this.errorMsg = 'Ocurrió un error al actualizar la contraseña.';
        this.isLoading = false;
      }
    });
  }

  private passwordsMatch(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  }
}
