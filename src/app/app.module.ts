import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HotelService } from './hotels/hotel.service';
import { CategoryService } from './shared/category.service';
import { AdService } from './ads/ad.servis';
import { AuthService } from './auth/auth.service';
import { AuthGuardService } from './auth/auth-guard.service';
import { UIService } from './shared/ui.service';

import { AuthModule } from './auth/auth.module';
import { HeaderComponent } from './header/header.component';
import { MaterialModule } from './material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    MaterialModule,
    FlexLayoutModule,
    HttpClientModule,

    AuthModule
  ],
  providers: [AuthService, AuthGuardService, HotelService, CategoryService, AdService, UIService],
  bootstrap: [AppComponent],

})
export class AppModule { }
