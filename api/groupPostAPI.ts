import api from './api';
import { AxiosPromise } from 'axios';
import { CreateGroupPostDto } from '../store/groupPostSlice';

export function createGroupPost(body: CreateGroupPostDto) {
  return new Promise<AxiosPromise>((resolve, reject) => {
    try {
      api.post(`/group-post`, body)
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

export function getAllGroupPosts(groupId: string) {
  return new Promise<AxiosPromise>((resolve, reject) => {
    try {
      api.get(`/group-post`, {
        params: {
          groupId,
        }
      })
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
