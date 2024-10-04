import { UserPlan } from '../entities';
import { find, get } from 'lodash';

export function makeid(length: number) {
  let result = '';
  const characters = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase();
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

// * by seconds
export function getDateDataTimeout(plan: UserPlan) {
  let secondsTimeout = 0;
  if (plan == UserPlan.free) secondsTimeout = 7 * 24 * 60 * 60;
  else if (plan == UserPlan.silver) secondsTimeout = 7 * 24 * 60 * 60;
  else if (plan == UserPlan.gold) secondsTimeout = 30 * 24 * 60 * 60;
  else if (plan == UserPlan.diamond) secondsTimeout = 60 * 24 * 60 * 60;

  const now = new Date();
  return new Date(now.getTime() + secondsTimeout * 1000);
}
