import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PagesModule } from './pages/pages.module';
import { ComponentsModule } from './components/components.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InternsettokenService } from './intersectors/jwtIntersector.service';
import { AuthService } from './services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import {EventBusService} from 'ngx-eventbus'
import { TaskService } from './services/task.service';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    PagesModule,
    ComponentsModule,
    HttpClientModule
  ],
  providers: [
    EventBusService,
    AuthService,
    TaskService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InternsettokenService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
