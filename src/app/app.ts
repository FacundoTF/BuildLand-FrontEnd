import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// import { Home } from "./core/home/home";
import { BasePage } from './core/base-page/base-page';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BasePage /* Home */],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('AngularFrontEnd');
}
