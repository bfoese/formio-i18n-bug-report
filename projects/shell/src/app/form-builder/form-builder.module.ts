import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormioModule } from '@formio/angular';
import { FormBuilderComponent } from './components/form-builder.component';
import { FormBuilderOptionsService } from './services/form-builder-options.service';

@NgModule({
  declarations: [FormBuilderComponent],
  imports: [CommonModule, FormioModule],
  exports: [FormBuilderComponent, FormBuilderOptionsService]
})
export class FormBuilderModule {}
