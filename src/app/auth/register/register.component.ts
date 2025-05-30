import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'; // ✅ Necesario para redirigir
import { AuthService } from 'src/app/services/auth-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router // ✅ Asegúrate de tenerlo
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#+_.-])[A-Za-z\d@$!%*?&#+_.-]{8,}$/)
      ]],
      confirmPassword: ['']
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (!password || !confirmPassword) return null;

    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mismatch: true });
      return { mismatch: true };
    } else {
      const errors = confirmPassword.errors;
      if (errors) {
        delete errors['mismatch'];
        confirmPassword.setErrors(Object.keys(errors).length ? errors : null);
      }
      return null;
    }
  }

  register() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      const { name, email, password } = this.registerForm.value;

      const user = {
        name: name,
        username: email, // ✅ Tu backend espera "username"
        password: password
      };

      this.authService.registerPublicUser(user).subscribe(
        (response) => {
          this.isLoading = false;

          if (response.requires2fa) {
            localStorage.setItem('temp_user', response.username);

            Swal.fire('Código requerido', response.message, 'info').then(() => {
              this.router.navigate(['/verificar-codigo'], {
                queryParams: { username: response.username }
              });
            });
          } else {
            Swal.fire('Registrado', 'Usuario registrado sin 2FA.', 'success');
          }
        },
        (error) => {
          this.isLoading = false;
          console.error(error);
          Swal.fire('Error', 'No se pudo completar el registro.', 'error');
        }
      );
    }
  }
}
