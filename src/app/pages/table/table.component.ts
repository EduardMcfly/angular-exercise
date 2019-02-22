import { Component, OnInit, ViewChild } from '@angular/core';
import { PersonRegisterComponent } from '../../component/common/person-register/person-register.component';
import { DataTableComponent } from '../../component/common/data-table/table.component';
import { DataTableResource } from '../../component/common/data-table/tools/data-table-resource';
import { PersonService } from '../../service/person/person.service';
import { Person } from 'src/app/models/common/person/index';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  @ViewChild(PersonRegisterComponent) responseModal: PersonRegisterComponent;
  @ViewChild(DataTableComponent) dataTable: DataTableComponent;


  public closeResult: string;
  public submitted = false;
  public isNew = true;
  itemResource = new DataTableResource([]);
  items = [];
  itemCount = 0;
  size = 6;
  totalPages: number;

  constructor(
    private personService: PersonService) {
  }

  ngOnInit(): void {
    const { data: persons } = this.personService.getAll();
    this.itemResource = new DataTableResource(persons);
    this.itemResource.count().then(data => {
      this.totalPages = Math.ceil(data / this.size);
    });
    this.responseModal.emitEvent.subscribe(({ data }: any) => {
      this.itemResource.updateItems(data);
      this.items = data;
      this.totalPages = Math.ceil(data.length / this.size);
    });
  }

  reloadItems(params) {
    this.itemResource.query(params).then(items => this.items = items);
  }

  selectAll() {
    const { data: persons } = this.personService
      .deleteSelection(
        this.dataTable.getSelectedRows()
          .map((obj) => obj.item.id)
      );
    this.itemResource.updateItems(persons);
    this.items = persons;
  }

  // special properties:
  rowClick(rowEvent) {
    console.log('Clicked: ' + rowEvent.row.item);
  }

  rowDoubleClick(rowEvent) {
    // alert('Double clicked: ' + rowEvent.row.item.name);
  }

  rowTooltip(item) {
    return item.NPI;
  }

  cellColor(car) {
    return '#fafafa';
  }

  buttonalert(param: any) {
    this.responseModal.open({ isNew: false, inputs: param, id: param.id });
  }

  delete(param: any) {
    const { data: persons } = this.personService.delete({ id: param.id });
    this.itemResource.updateItems(persons);
    this.items = persons;
  }
}
