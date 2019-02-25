import { Component, OnInit, Input, Output, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import isNumeric from 'validator/lib/isNumeric';
import isEmail from 'validator/lib/isEmail';
import { Person } from '../../../models/common/person';
import { PersonService } from '../../../service/person/person.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-person-register',
  templateUrl: './person-register.component.html',
  styleUrls: ['./person-register.component.scss']
})
export class PersonRegisterComponent implements OnInit {
  closeResult: string;
  formPerson: FormGroup;
  submitted = false;
  isNew = true;
  id: number;

  @Output() emitEvent: EventEmitter<any> = new EventEmitter();

  @ViewChild('content')
  public template: TemplateRef<any>;



  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private personService: PersonService,
  ) {
  }

  ngOnInit() {
    const { name, identification, lastName, phone, email } = { name: '', identification: '', lastName: '', phone: '', email: '' };
    this.formPerson = this.formBuilder.group({
      identification: [identification, Validators.required],
      name: [name, Validators.required],
      lastName: [
        lastName,
        [
          Validators.required
        ]
      ],
      phone: [
        phone,
        [
          Validators.required,
          (control: AbstractControl) => {
            const val = control.value;
            try {
              return isNumeric(val.toString()) === false
                ? { invalidNumber: true }
                : null;
            } catch (error) {
              return { invalidNumber: true };
            }
          }
        ]
      ],
      email: [
        email,
        [
          Validators.required,
          (control: AbstractControl) => {
            const val = control.value;
            try {
              return isEmail(val.toString()) === false
                ? { invalidEmail: true }
                : null;
            } catch (error) {
              return { invalidEmail: true };
            }
          }
        ]
      ]
    });
  }
  // convenience getter for easy access to form fields
  get f() {
    return this.formPerson.controls;
  }

  open({ isNew, inputs, id }: { isNew: boolean, inputs?: Person, id?: number }) {
    if (inputs && !isNew) {
      this.id = id;
      _.forEach(this.f, (control, key) => {
        control.setValue(inputs[key]);
      });
    }

    this.isNew = isNew;
    this.modalService.open(this.template, { ariaLabelledBy: 'modal-basic-title' }).result.then(obj => {
      if (!this.isNew) {
        _.forEach(this.f, (control, key) => {
          control.setValue('');
        });
      }
    }).catch(obj => {
      if (!this.isNew) {
        _.forEach(this.f, (control, key) => {
          control.setValue('');
        });
      }
    });
  }

  response(response) {

  }

  public validateExit({ close }: any) {
    const formPerson = this.formPerson.controls;
    const { name, identification, lastName, phone, email } = formPerson;
    this.submitted = true;
    _.forEach(formPerson, control => {
      /**
       * @event realiza validaciones en todos los formularios
       */
      control.markAsTouched();
    });

    // stop here if form is invalid
    if (this.formPerson.invalid) {
      return;
    }

    const newPerson: Person = {
      name: name.value,
      identification: identification.value,
      lastName: lastName.value,
      phone: phone.value,
      email: email.value
    } as Person;
    if (this.isNew) {
      const response = this.personService.add(newPerson);
      const { success } = response;
      if (success) {
        const { data } = response;
        this.submitted = false;
        close();
        this.emitEvent.emit({ data });
      } else {
        const { errors } = response;
        errors.map(input => {
          formPerson[input].setErrors({ exist: true });
        });
      }
    } else {
      const response = this.personService.update({ ...newPerson, id: this.id });
      const { success } = response;
      if (success) {
        const { data } = response;
        this.submitted = false;
        close();
        this.emitEvent.emit({ data });
      } else {
        const { errors } = response;
        errors.map(input => {
          formPerson[input].setErrors({ exist: true });
        });
      }
    }
  }
}
