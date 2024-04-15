import { useState } from 'react';
import { Calendar } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { addHours } from 'date-fns'

import { Navbar } from "../componets/Navbar"
import { localizer, getMessagesES } from '../../helpers';
import { CalendarEvent } from '../componets/CalendarEvent';
import { CalendarModal } from '../componets/CalendarModal';
import { useAuthStore, useUiStore } from '../../hooks';
import { useCalendarStore } from '../../hooks/useCalendarStore';
import { FabAddNew } from '../componets/FabAddNew';
import { FabDelete } from '../componets/FabDelete';
import { useEffect } from 'react';

export const CalendarPage = () => {

    const { user } = useAuthStore();
    const { openDateModal } = useUiStore();
    const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'week')
    const { events, setActiveEvent, startLoadingEvents } = useCalendarStore()

    const eventStyleGetter = (event, start, end, isSelected) => {

        const isMyEvent = (user.uid === event.user._id) || (user.uid === event.user.uid)

        console.log(event)

        const style = {
            backgroundColor: isMyEvent ? '#347CF7' : '465660',
            borderRadius: '0px',
            opacity: 0.8,
            color: 'white'
        }

        return {
            style
        }
    }

    const onDoubleClick = (event) => {
        // console.log({ onDoubleClick: event });
        openDateModal()
    }

    const onSelect = (event) => {
        setActiveEvent(event)
    }

    const onViewChanged = (event) => {
        localStorage.setItem('lastView', event);
        setLastView(event)
    }

    useEffect(() => {

        startLoadingEvents();
    }, [])


    return (
        <>
            <Navbar />

            <Calendar
                culture='es'
                localizer={localizer}
                events={events}
                defaultView={lastView}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 'calc( 100vh - 80px' }}
                messages={getMessagesES()}
                eventPropGetter={eventStyleGetter}
                components={{
                    event: CalendarEvent
                }}
                onDoubleClickEvent={onDoubleClick}
                onSelectEvent={onSelect}
                onView={onViewChanged}
            />

            <CalendarModal />
            <FabAddNew />
            <FabDelete />

        </>
    )
}