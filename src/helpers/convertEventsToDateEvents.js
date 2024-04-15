import { parseISO } from "date-fns";

export const convertEventsToDateEvents = (events = []) => {

    return events.map(events => {

        events.end = parseISO( events.end );
        events.start = parseISO( events.start );

        return events;
    })
}