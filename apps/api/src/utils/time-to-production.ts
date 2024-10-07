import { differenceInDays } from 'date-fns';
import {ICreateEnabledDates} from "@abflags/shared";

const calculateTimeToProdForFeatures = (
    items: ICreateEnabledDates[],
): number[] =>
    items.map((item) => differenceInDays(item.enabled, item.created));

export const calculateAverageTimeToProd = (
    items: ICreateEnabledDates[],
): number => {
    const timeToProdPerFeature = calculateTimeToProdForFeatures(items);
    if (timeToProdPerFeature.length) {
        const sum = timeToProdPerFeature.reduce((acc, curr) => acc + curr, 0);
        const avg = sum / Object.keys(items).length;

        return Number(avg.toFixed(1)) || 0.1;
    }

    return 0;
};
