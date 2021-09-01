import { HttpClientModule } from '@angular/common/http';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { FormBuilderModule } from './form-builder/form-builder.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule, FormBuilderModule],
  bootstrap: [AppComponent],
  providers: [{ provide: LOCALE_ID, useValue: 'de' }]
})
export class AppModule {}
