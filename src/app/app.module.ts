import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { VizTrackComponent } from './viz-track/viz-track.component';

import { AudioService } from './services/audio.service';
import { VizBarsComponent } from './viz-track/viz-bars/viz-bars.component'

@NgModule({
  declarations: [
    AppComponent,
    VizTrackComponent,
    VizBarsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule
  ],
  providers: [AudioService],
  bootstrap: [AppComponent]
})
export class AppModule { }
