import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideBar } from '../../shared/components/side-bar/side-bar';

@Component({
  selector: 'app-base-page',
  imports: [RouterOutlet, SideBar],
  templateUrl: './base-page.html',
  styleUrl: './base-page.css',
})
export class BasePage {}
