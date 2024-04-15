import { onCloseDateModal, onOpenDateModal, uiSlice } from "../../../src/store"

describe('Pruebas en uiSlice', () => {

    test('debe de regresar el estado por defecto', () => {

        console.log(uiSlice.getInitialState());
    })

    test('should debe de cambiar el isDateModalOpen correctamente', () => {

        let state = uiSlice.getInitialState();

        state = uiSlice.reducer(state, onOpenDateModal())
        console.log(state)
        expect( state.isDateModalOpen ).toBeTruthy()

        state = uiSlice.reducer(state, onCloseDateModal())
        expect( state.isDateModalOpen ).toBeFalsy()

    })
})