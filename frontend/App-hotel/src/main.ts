import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AppRoutingModule } from './app/app-routing.module';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(AppRoutingModule.routes),
    importProvidersFrom(
      HttpClientModule,
      FormsModule,
      BrowserAnimationsModule,
      MatToolbarModule,
      MatButtonModule,
      MatFormFieldModule,
      MatInputModule
    )
  ]
}).catch(err => console.error(err));
