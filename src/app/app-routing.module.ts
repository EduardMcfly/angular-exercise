import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TableComponent } from './pages/table/table.component';
import { TableAdvancedComponent } from './pages/table-advanced/table-advanced.component';

const routes: Routes = [
  { path: 'table/basic', component: TableComponent },
  { path: 'table/advanced', component: TableAdvancedComponent },
  { path: '*', redirectTo: '/table/basic', pathMatch: 'full' },
  { path: '', redirectTo: '/table/basic', pathMatch: 'full' }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
