import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login.component';
import { PosComponent } from './features/pos/pos.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'pos', component: PosComponent },
];
