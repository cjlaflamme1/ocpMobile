import { User } from "./userSlice";

export interface Notifications {
  title: string;
  description: string;
  groupId?: string;
  postId?: string;
  eventId?: string;
  viewed: boolean;
  user?: User;
}