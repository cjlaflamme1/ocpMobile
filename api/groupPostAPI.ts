import api from './api';
import { AxiosPromise } from 'axios';
import { CreateGroupPostDto } from '../store/groupPostSlice';

export function createGroupPost(body: CreateGroupPostDto) {
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
