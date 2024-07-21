import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AppRoutingModule } from './app-routing.module';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { ClientsComponent } from './clients/clients.component';

@NgModule({
  declarations: [
    // Declare all your components here
  ],
  imports: [
    BrowserModule,
    CommonModule, // Add CommonModule here
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule, // Example: Include MatCardModule
    MatListModule, // Example: Include MatListModule
    MatInputModule,
    AppRoutingModule,
    ClientsComponent
  ],
  providers: [],
  bootstrap: [] // Do not bootstrap AppComponent here if you are using standalone components
})
export class AppModule { }