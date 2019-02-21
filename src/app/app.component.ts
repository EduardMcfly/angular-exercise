import { Component } from '@angular/core';
const navList: { title: string; path: string; icon?: string }[] = [
  { path: 'table/basic', title: 'Personas Basico' },
  { path: 'table/advanced', title: 'Personas Avanzado' },
];
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'my-project';
  navList = navList;
}
