import { create } from "zustand";

export type Notification = {
  id: string;
  text: string;
};

export type NotificationStoreState = {
  notifications: Notification[];
  addNotification: (text: string) => void;
  removeNotification: (id: string) => void;
};

export const useNotificationStore = create<NotificationStoreState>((set) => ({
  notifications: [],
  addNotification: (text) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        { id: Date.now().toString(), text },
      ],
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((item) => item.id !== id),
    })),
}));
