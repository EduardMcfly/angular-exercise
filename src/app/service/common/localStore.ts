export class LocalStore {
  key;
  constructor({ key }) {
    this.key = key;
  }
  set(data: any): any {
    localStorage.setItem(this.key, JSON.stringify(data));
    return data;
  }
  get(): any {
    return JSON.parse(localStorage.getItem(this.key));
  }
}
