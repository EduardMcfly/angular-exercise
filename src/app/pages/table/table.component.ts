import { Component, OnInit, ViewChild } from '@angular/core';
import { PersonRegisterComponent } from "../../component/common/person-register/person-register.component";
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  @ViewChild('modalPerson') responseModal: PersonRegisterComponent;


  public closeResult: string;
  public submitted = false;
  public isNew = true;


  constructor(
  ) { }

  ngOnInit() {
    this.responseModal.emitEvent.subscribe((data: any) => {
      console.log(data);
    });
  }
}
