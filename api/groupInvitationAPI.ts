import api from './api';
import { AxiosPromise } from 'axios';

export function getAllInvitations() {
  return new Promise<AxiosPromise>((resolve, reject) => {
    try {
      api.get('/group-invitation')
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