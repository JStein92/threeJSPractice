import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CubeComponent } from './cube/cube.component';
import { AppComponent } from './app.component';
import { FrameComponent } from './frame/frame.component';

@NgModule({
  declarations: [
    AppComponent,
    FrameComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
