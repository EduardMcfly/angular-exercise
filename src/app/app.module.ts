import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { TableComponent } from './pages/table/table.component';
import { TableAdvancedComponent } from './pages/table-advanced/table-advanced.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PersonRegisterComponent } from './component/common/person-register/person-register.component';
import { DataTableModule } from './component/common/data-table/data-table.module';

@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    TableAdvancedComponent,
    PersonRegisterComponent,
  ],
  imports: [
    FormsModule,
    DataTableModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
