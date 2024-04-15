import { authSlice, clearErrorMessage, onLogin, onLogout } from "../../../src/store"
import { authenticatedState, initialState } from "../fixtures/authState"
import { testUserCredentials } from "../fixtures/testUser"

describe('Pruebas en authSlice', () => {

    test('should debe de regresar el estado inicial', () => {

        expect(authSlice.getInitialState()).toEqual(initialState)
    })

    test('should debe de realizar un login', () => {

        const state = authSlice.reducer(initialState, onLogin(testUserCredentials));
        expect(state).toEqual({
            status: 'authenticated',
            user: testUserCredentials,
            errorMessage: undefined,
        })
    })

    test('should debe de realizar el logout ', () => { 
        
        const state = authSlice.reducer( authenticatedState, onLogout());

        expect( state ).toEqual({
            status: 'not-authenticated',
            user: {},
            errorMessage: undefined,
        })
     })

     test('should debe de realizar el logout y tener un errorMessage ', () => { 
        
        const errorMessage = 'Credenciales no válidas'
        const state = authSlice.reducer( authenticatedState, onLogout(errorMessage));

        expect( state ).toEqual({
            status: 'not-authenticated',
            user: {},
            errorMessage
        })
     })

     test('should debe de limpiar el mensaje de error', () => { 
        
        const errorMessage = 'Credenciales no válidas';
        const state = authSlice.reducer( authenticatedState, onLogout(errorMessage))
        const newState = authSlice.reducer( state, clearErrorMessage() )

        expect( newState.errorMessage ).toBe( undefined )
      })
})