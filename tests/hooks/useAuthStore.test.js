import { configureStore } from '@reduxjs/toolkit'
import { act, renderHook, waitFor } from "@testing-library/react"
import { useAuthStore, useUiStore } from "../../src/hooks"
import { Provider } from 'react-redux'
import { authSlice, store, uiSlice } from "../../src/store"
import { authenticatedState, initialState, notAuthenticatedState } from '../store/fixtures/authState'
import { testUserCredentials } from '../store/fixtures/testUser'
import { calendarApi } from '../../src/api'

const getMockStore = (initialState) => {
    return configureStore({
        reducer: {
            auth: authSlice.reducer
        },
        preloadedState: {
            auth: { ...initialState }
        }
    })
}

describe('pruebas en useAuthStore', () => {

    beforeEach(() => localStorage.clear());

    test('should debe de regresar los valores poe defecto', () => {

        const mockStore = getMockStore({
            status: 'checking', //authenticated, not-authenticated
            user: {},
            errorMessage: undefined
        })

        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        expect(result.current).toEqual({
            errorMessage: undefined,
            status: 'checking',
            user: {},

            checkAuthToken: expect.any(Function),
            startLogin: expect.any(Function),
            startLogout: expect.any(Function),
            startRegister: expect.any(Function),
        })

    })

    test('should startLoign debe de hacer el login correctamente', async () => {


        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        await act(async () => {

            await result.current.startLogin({ ...testUserCredentials })
        })

        const { errorMessage, user, status } = result.current;

        expect({ errorMessage, user, status }).toEqual({
            errorMessage: undefined,
            user: { name: 'Test User', uid: expect.any(String) },
            status: 'authenticated',
        })

        expect(localStorage.getItem('token')).toEqual(expect.any(String))
        expect(localStorage.getItem('token-init-date')).toEqual(expect.any(String))
        console.log(result.current)

    })

    test('should debe de fallar la autenticación', async () => {
        localStorage.clear()
        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        await act(async () => {

            await result.current.startLogin({ email: 'no', password: 'no1' })
        });

        const { errorMessage, user, status } = result.current;
        expect({ errorMessage, user, status }).toEqual({
            errorMessage: expect.any(String),
            user: {},
            status: 'not-authenticated'
        })
        expect(localStorage.getItem('token')).toBe(null)

        await waitFor(() => {
            expect(result.current.errorMessage).toBe(undefined);
        })
    })

    test('should el startRegister debe de crear un nuevo usuario', async () => {

        const newUser = { email: 'nooooo@gmail.com', password: 'no1234', name: 'no' };

        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        const spy = jest.spyOn(calendarApi, 'post').mockReturnValue({
            data: {
                "ok": true,
                "uid": "ALGUN-ID",
                "name": "Test User",
                "token": "ALGUN-TOKEN"
            }
        })

        await act(async () => {

            await result.current.startRegister(newUser)
        });

        const { errorMessage, user, status } = result.current;

        expect({ errorMessage, user, status }).toEqual({
            errorMessage: undefined,
            user: { name: 'no', uid: 'ALGUN-ID' },
            status: 'authenticated'
        })

        spy.mockRestore();
    })

    test('should startREgister debe de fallar la creacion', async () => {

        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        await act(async () => {

            await result.current.startRegister(testUserCredentials)
        });

        const { errorMessage, user, status } = result.current;

        expect({ errorMessage, user, status }).toEqual({
            errorMessage: 'Ya existe un usuario con ese correo',
            user: {},
            status: 'not-authenticated'
        })

    })

    test('should debe de fallar el checkAuthTOken', async () => {

        const mockStore = getMockStore({ ...initialState });
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        console.log('token', localStorage.getItem('token'))

        await act(async () => {

            await result.current.checkAuthToken()
        });

        const { errorMessage, user, status } = result.current;

        expect({ errorMessage, user, status }).toEqual({
            errorMessage: undefined,
            user: {},
            status: 'not-authenticated'
        })
    })

    test('should checkAuthTOken debe de authenticar el tokek', async () => {

        const { data } = await calendarApi.post('/auth', testUserCredentials);
        localStorage.setItem('token', data.token)


        const mockStore = getMockStore({ ...initialState });
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        console.log('token', localStorage.getItem('token'))

        await act(async () => {

            await result.current.checkAuthToken()
        });

        const { errorMessage, user, status } = result.current;

        console.log({ errorMessage, user, status })

        expect({ errorMessage, user, status }).toEqual({
            errorMessage: undefined,
            user: { name: 'Test User', uid: '661b0c15d4d5ba270b01e31f' },
            status: 'authenticated'
        })
    })
})