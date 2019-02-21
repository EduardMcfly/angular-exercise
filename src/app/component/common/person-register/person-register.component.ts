import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
  @Output() emitEvent: EventEmitter<any> = new EventEmitter();


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

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
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
      const reponse = this.personService.add(newPerson);
      const { success } = reponse;
      if (success) {
        const { data } = reponse;
        close();
        this.emitEvent.emit({ data });
      } else {
        const { errors } = reponse;
        errors.map(input => {
          formPerson[input].setErrors({ exist: true });
        });
      }
    } else {
      this.personService
        .update({ ...newPerson, id: 3434 } as Person);
    }
  }
}
