import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { LoaderComponent } from './loader/loader.component';
import { IntroSliderComponent } from './intro-slider/intro-slider.component';

@NgModule({
  imports: [IonicModule, CommonModule],
  declarations: [LoaderComponent, IntroSliderComponent],
  exports: [LoaderComponent, IntroSliderComponent]
})
export class SharedModule {}
