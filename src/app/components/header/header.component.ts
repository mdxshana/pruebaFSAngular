import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { EventBusService } from 'ngx-eventbus';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  navbarOpen = false;

  isAuth = false;

  eventAuth: any;

  constructor(private eventBus: EventBusService, public router: Router) {
    this.isAuthenticate();
  }

  ngOnDestroy() {
    this.eventBus.removeEventListener(this.eventAuth);
  }

  ngOnInit(): void {
    this.eventAuth = this.eventBus.addEventListener({
      name: 'auth',
      callback: (payload: any) => {
        this.isAuthenticate();
      },
    });
  }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

  logout() {
    localStorage.clear();
    this.isAuthenticate();
    this.router.navigate(['/login'])
  }

  isAuthenticate() {
    let existToken = localStorage.getItem('token');
    if (existToken) {
      this.isAuth = true;
    } else {
      this.isAuth = false;
    }
  }
}
