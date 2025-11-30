import { Component } from '@angular/core';
import { SideBar } from '../../shared/components/side-bar/side-bar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-base-page',
  imports: [SideBar, RouterOutlet],
  templateUrl: './base-page.html',
  styleUrl: './base-page.css',
})
export class BasePage {}
