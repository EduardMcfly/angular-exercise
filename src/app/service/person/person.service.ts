import { Injectable } from '@angular/core';
import { Person } from '../../models/common/person';
import { LocalStore } from '../common/localStore';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  localStore = new LocalStore({ key: 'person' });
  constructor() { }

  validate(values: Person) {
    const data = this.localStore.get();
    const validates = ['email', 'identification', 'phone'];
    const errors = [];
    let state = true;
    if (data) {
      validates.map(input => {
        if (data.find(obj => values[input] === obj[input]) !== undefined) {
          state = false;
          errors.push(input);
        }
      });
    }
    return { state, errors };
  }


  //////// Get methods //////////
  getAll(): { success: boolean, data: Person[] } {
    return {
      success: true,
      data: this.localStore.get()
    };
  }

  //////// Save methods //////////

  /** POST: add a new person to the database */
  add(person: Person) {
    const validate = this.validate(person);
    if (!validate.state) {
      return { success: false, errors: validate.errors };
    }
    const data = this.localStore.get() ? this.localStore.get() : [];
    const maxid = Math.max(...data.map((obj, key) => obj.id));
    return {
      success: true,
      data: this.localStore.set([
        ...data,
        { ...person, id: maxid === -Infinity ? 1 : maxid + 1 }
      ])
    };
  }

  /** POST: add a new person to the database */
  update(person: Person): Person[] {
    return [];
  }
}
