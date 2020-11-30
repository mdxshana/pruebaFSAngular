import { Route } from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User.model';
import { AuthService } from 'src/app/services/auth.service';
import { EventBusService } from 'ngx-eventbus';
import swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  user: User;

  constructor(
    public formBuilder: FormBuilder,
    private _authService: AuthService,
    protected router: Router,
    private eventBus: EventBusService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required])],
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.loginForm.valid) {
      this.user = new User();
      Object.assign(this.user, this.loginForm.value);
      this._authService.login(this.user).subscribe(
        (resp) => {
          this.eventBus.triggerEvent('auth');
          this.router.navigate(['/tasks']);
        },
        (err) => {
         swal.fire("¡Advertencia!",err.error.err.message,'error')
        }
      );
    }
  }
}
