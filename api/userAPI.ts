import api from './api';
import { AxiosPromise } from 'axios';
import { User } from '../store/userSlice';

export function getCurrentUser() {
  return new Promise<AxiosPromise>((resolve, reject) => {
    try {
      api.get('/user')
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

export function updateCurrentUser(id: string, updateBody: Partial<User>) {
  return new Promise<AxiosPromise>((resolve, reject) => {
    try {
      api.patch(`/user/${id}`, updateBody)
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
