import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { OrdersComponent } from './orders/orders.component';
import { RoomsComponent } from './rooms/rooms.component';
import { ReservationsComponent } from './reservations/reservations.component';
import { TreatmentsComponent } from './treatments/treatments.component';
import { TicketsComponent } from './tickets/tickets.component';
import { ContactComponent } from './contact/contact.component';

const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'rooms', component: RoomsComponent },
  { path: 'reservations', component: ReservationsComponent },
  { path: 'treatments', component: TreatmentsComponent },
  { path: 'tickets', component: TicketsComponent },
  { path: 'contact', component: ContactComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  static routes = routes;
}
