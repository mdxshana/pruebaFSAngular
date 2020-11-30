import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/User.model';
import { AuthService } from 'src/app/services/auth.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm:FormGroup;
  user:User;
  constructor(
    public formBuilder: FormBuilder,
    protected _authService:AuthService
  ) {
    this.registerForm = this.formBuilder.group({
      nombre: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required])],
      password: ['',Validators.compose([
        Validators.required,
        Validators.minLength(6)
      ])]
    });
   }

  ngOnInit(): void {
  }


  onSubmit(){
    if(this.registerForm.valid){
      this.user = new User;
      Object.assign(this.user, this.registerForm.value);

      this._authService.register(this.user).subscribe(resp =>{
        swal.fire('¡Bien!','Usuario registrado satisfactoriamente','success');
        this.registerForm.reset();
      })
    }
  }

}
