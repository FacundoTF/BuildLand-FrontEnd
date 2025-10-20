import { Component } from '@angular/core';
import { SideBar } from "../../shared/components/side-bar/side-bar";

@Component({
  selector: 'app-base-page',
  imports: [SideBar],
  templateUrl: './base-page.html',
  styleUrl: './base-page.css'
})
export class BasePage {

}
