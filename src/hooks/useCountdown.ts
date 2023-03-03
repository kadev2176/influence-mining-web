import { useState } from "react";
import { useInterval } from "./useInterval";
import dayjs from 'dayjs'
const utc = require('dayjs/plugin/utc')
dayjs.extend(utc);

export const useCountdown = () => {
  const [countdown, setCountdown] = useState<{ hours: string; mins: string }>({ hours: '-', mins: '-' });

  useInterval(() => {
    const nextMidnight = (dayjs as any).utc().hour(0).minute(0).second(0).millisecond(0).add(1, 'day');
    const diff = nextMidnight.unix() - (dayjs as any).utc().unix();
    const hours = Math.floor(diff / 3600);
    const mins = Math.ceil((diff % 3600 / 60));
    setCountdown({
      hours: `${hours}`,
      mins: `${mins}`
    })
  }, 1000, true);

  return countdown;
}