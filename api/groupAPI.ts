import api from './api';
import { AxiosPromise } from 'axios';

export function createGroup(body: any) {
  return new Promise<AxiosPromise>((resolve, reject) => {
    try {
      api.post(`/group`, body)
        .then((response: any) => {
          resolve(response);
        }).catch((e: Error) => {
          reject(e);
        })
    } catch (e) {
      reject(e);
    }
  })
}

export function getAllGroups() {
  return new Promise<AxiosPromise>((resolve, reject) => {
    try {
      api.get('/group')
        .then((response: any) => {
          resolve(response);
        })
        .catch((e: Error) => {
          reject(e);
        })
    } catch (e) {
      reject(e);
    }
  })
}
