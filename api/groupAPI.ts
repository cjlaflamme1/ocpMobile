import api from './api';
import { AxiosPromise } from 'axios';
import { QueryObject } from '../models/QueryObject';

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

export function getAllGroups(query: QueryObject) {
  return new Promise<AxiosPromise>((resolve, reject) => {
    try {
      api.get('/group', {
        params: {
          dataSource: JSON.stringify(query),
        }
      })
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

export function getUserGroups(query: QueryObject) {
  return new Promise<AxiosPromise>((resolve, reject) => {
    try {
      api.get('/group/current', {
        params: {
          dataSource: JSON.stringify(query),
        }
      })
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
