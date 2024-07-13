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
import { ClientsComponent } from './clients/clients.component';
import { ManageOrdersComponent } from './manage-orders/manage-orders.component';
import { ManageTicketsComponent } from './manage-tickets/manage-tickets.component';
import { ManageTreatmentsComponent } from './manage-treatments/manage-treatments.component';

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
  { path: 'clients', component: ClientsComponent },
  { path: 'manage-orders', component: ManageOrdersComponent },
  { path: 'manage-tickets', component: ManageTicketsComponent },
  { path: 'manage-treatments', component: ManageTreatmentsComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  static routes = routes;
}
