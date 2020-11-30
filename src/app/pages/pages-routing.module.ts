import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; // CLI imports router
import { AuthGuard } from '../guard/auth.guard';
import { LoginComponent } from './login/login.component';
import { PagesComponent } from './pages.component';
import { RegisterComponent } from './register/register.component';
import { TaskComponent } from './task/task.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'tasks', component: TaskComponent, canActivate:[AuthGuard] },
    ],
  },

]; // sets up routes constant where you define your routes

// configures NgModule imports and exports
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
