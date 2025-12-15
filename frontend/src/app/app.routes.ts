import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPage } from './components/landing-page/landing-page';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProductComponent } from './components/products/products';
import { AdminPage } from './components/admin/admin';
import { AdminGuard } from './guards/admin-guard';
import { CartComponent } from './components/cart/cart';



export const routes: Routes = [
  { path: 'landing', component: LandingPage },   //  landing page
  { path: '', component: LoginComponent },    // default login page
  { path: 'register', component: RegisterComponent }, // register page
  {path: 'products', component: ProductComponent}, // products page
  {path: 'cart', component: CartComponent}, // checkout page
  { path: 'admin', component: AdminPage, canActivate: [AdminGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
