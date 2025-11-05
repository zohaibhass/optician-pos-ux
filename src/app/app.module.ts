
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { PosComponent } from './pos/pos.component';
import { LoginComponent } from './auth/login.component';
import { AuthService } from './auth/auth.service';
import { ApiInterceptor } from './shared/api.interceptor';

@NgModule({
  declarations: [AppComponent, PosComponent, LoginComponent],
  imports: [BrowserModule, HttpClientModule, FormsModule],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true }, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule {}
