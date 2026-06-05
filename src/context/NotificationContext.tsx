import React, { createContext, useState, type ReactNode } from "react";

export type Notification = {
  id: string;
  text: string;
};

export type NotificationContextValue = {
  notifications: Notification[];
  addNotification: (text: string) => void;
  removeNotification: (id: string) => void;
};

export const NotificationContext =
  createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (text: string) => {
    setNotifications((current) => [
      ...current,
      { id: Date.now().toString(), text },
    ]);
  };

  const removeNotification = (id: string) => {
    setNotifications((current) => current.filter((item) => item.id !== id));
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, removeNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
