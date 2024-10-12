import { v4 as uuidv4 } from 'uuid';
import {AbContext} from "../types";

class EventsHandler {
    private generateEventId() {
        return uuidv4();
    }

    public createImpressionEvent(
        context: AbContext,
        enabled: boolean,
        featureName: string,
        eventType: string,
        impressionData?: boolean,
        variant?: string
    ) {
        const baseEvent = this.createBaseEvent(
            context,
            enabled,
            featureName,
            eventType,
            impressionData
        );

        if (variant) {
            return {
                ...baseEvent,
                variant,
            };
        }
        return baseEvent;
    }

    private createBaseEvent(
        context: AbContext,
        enabled: boolean,
        featureName: string,
        eventType: string,
        impressionData?: boolean
    ) {
        return {
            eventType,
            eventId: this.generateEventId(),
            context,
            enabled,
            featureName,
            impressionData,
        };
    }
}

export default EventsHandler;
