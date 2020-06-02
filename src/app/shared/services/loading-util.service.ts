import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class LoadingUtilService {

  public isLoading: boolean;

  constructor() { }

  setLoadingStatus(status: boolean) {
    this.isLoading = status;
  }

  getLoadingStatus() {
    return this.isLoading;
  }
}
