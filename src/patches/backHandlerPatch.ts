import { BackHandler } from 'react-native';

type Handler = (...args: any[]) => boolean;

const originalAdd = BackHandler.addEventListener.bind(BackHandler);
const subscriptions = new Map<Handler, any[]>();

(BackHandler as any).addEventListener = (
  eventName: string,
  handler: Handler
) => {
  const sub = originalAdd(eventName, handler);
  const arr = subscriptions.get(handler) ?? [];
  arr.push(sub);
  subscriptions.set(handler, arr);
  return sub;
};

if (!(BackHandler as any).removeEventListener) {
  (BackHandler as any).removeEventListener = (
    _eventName: string,
    handler: Handler
  ) => {
    const arr = subscriptions.get(handler);
    if (arr) {
      arr.forEach((sub) => sub?.remove?.());
      subscriptions.delete(handler);
    }
  };
}
