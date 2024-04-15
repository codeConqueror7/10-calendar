import { calendarSlice, onAddNewEvent, onDeleteEvent, onLoadEvents, onLogoutCalendar, onSetActiveEvent, onUpdateEvent } from "../../../src/store"
import { calendarWithActiveEventState, calendarWithEventsState, events, initialState } from "../fixtures/calendarState"

describe('pruebas en el calendarSlice', () => {

    test('should debe de regresar el estado por defecto', () => {

        const state = calendarSlice.getInitialState();
        expect(state).toEqual(initialState)
    })

    test('should onSetActiveEvent debe de activarse', () => {

        const state = calendarSlice.reducer(calendarWithEventsState, onSetActiveEvent(events[0]))
        // console.log(state)
        expect(state.activeEvent).toEqual(events[0])
    })

    test('should debe de agregar un evento', () => {

        const newEvent = {
            id: '10',
            start: new Date('2022-10-21 13:00:00'),
            end: new Date('2022-10-21 15:00:00'),
            title: 'Cumpleaños de Fernando',
            notes: 'Alguna nota'
        }

        const state = calendarSlice.reducer(initialState, onAddNewEvent(newEvent))
        // console.log(state)
        expect(state.events.length).toBe(1)
    })

    test('should debe de actualizar el evento', () => {

        const newEvent = {
            id: 1,
            start: new Date('2022-10-21 13:00:00'),
            end: new Date('2022-10-21 15:00:00'),
            title: 'Cumpleaños de Fernando!!!',
            notes: 'Alguna nota!!!!!! ACTUALIZADO'
        }

        const state = calendarSlice.reducer(calendarWithEventsState, onUpdateEvent(newEvent));
        // console.log(state)
        expect(state.events).toContain(newEvent)


    })


    test('should debe de borra el evento', () => {

        const state = calendarSlice.reducer(calendarWithActiveEventState, onDeleteEvent())
        // console.log(state)
        expect(state.events.length).toBe(1)

    })

    test('should debe de cargar los eventos', () => { 
        
        const state = calendarSlice.reducer( initialState, onLoadEvents(events) )
        expect( state ).toEqual( calendarWithEventsState )
     })

     test('should debe de estar en el estado inicial cuando se deslougea', () => { 

        const state = calendarSlice.reducer( calendarWithActiveEventState, onLogoutCalendar())
        expect( state ).toEqual( initialState )
     })
})