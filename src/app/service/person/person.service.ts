import { Injectable } from '@angular/core';
import { Person, ResponsePerson } from '../../models/common/person';
import { LocalStore } from '../common/localStore';


@Injectable({
  providedIn: 'root'
})
export class PersonService {
  localStore = new LocalStore({ key: 'person' });
  constructor() { }

  validate(values: Person, { isNew, id } = { isNew: true, id: -1 }) {
    const data = this.localStore.get();
    const validates = ['email', 'identification', 'phone'];
    const errors = [];
    let state = true;
    if (data) {
      validates.map(input => {
        if (data.find(obj => {
          if (isNew) {
            return values[input] === obj[input];
          } else {
            return values[input] === obj[input] && data[id][input] !== values[input];
          }
        }) !== undefined) {
          state = false;
          errors.push(input);
        }
      });
    }
    return { state, errors };
  }


  //////// Get methods //////////
  getAll(): ResponsePerson {
    return {
      success: true,
      data: this.localStore.get()
    };
  }

  //////// Save methods //////////

  add(person: Person) {
    const validate = this.validate(person);
    if (!validate.state) {
      return { success: false, errors: validate.errors };
    }
    const data = this.localStore.get() ? this.localStore.get() : [];
    const maxid = Math.max(...data.map(obj => obj.id));
    return {
      success: true,
      data: this.localStore.set([
        ...data,
        { ...person, id: maxid === -Infinity ? 1 : maxid + 1 }
      ])
    };
  }

  update(person): ResponsePerson {
    const data = this.localStore.get() ? this.localStore.get() : [];

    const id = data.findIndex(obj => obj.id === person.id);

    const validate = this.validate(person, { isNew: false, id });
    if (!validate.state) {
      return { success: false, errors: validate.errors };
    }

    data[id] = person;

    return {
      success: true,
      data: this.localStore.set(data)
    };
  }

  delete({ id }): ResponsePerson {
    const data = this.localStore.get() ? this.localStore.get() : [];
    return {
      success: true,
      data: this.localStore.set(data.splice(data.map(obj => obj.id).indexOf(id), 0))
    };
  }

  deleteSelection(ids): ResponsePerson {
    let data = this.localStore.get() ? this.localStore.get() : [];
    ids.map((id) => { data = data.splice(data.map(obj => obj.id).indexOf(id)); });
    return {
      success: true,
      data: this.localStore.set(data)
    };
  }
}
