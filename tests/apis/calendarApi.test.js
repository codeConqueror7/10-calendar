import { calendarApi } from "../../src/api"

describe('Pruebas en calendarApi', () => {

    test('Debe de tener la configuración por defecto', () => {

        console.log(calendarApi);

        expect(calendarApi.defaults.baseURL).toBe(process.env.VITE_API_URL);
    })

    test('should debe de tener el x-token en todas las peticiones', async () => {

        localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2NjFiMGMxNWQ0ZDViYTI3MGIwMWUzMWYiLCJuYW1lIjoiVGVzdCBVc2VyIiwiaWF0IjoxNzEzMDUxMjE1LCJleHAiOjE3MTMwNTg0MTV9.vNAVENDy6GdGGTjH8idefxhm_7bat4osrDqB0qxr9L8')

        const res = await calendarApi.get('/auth/renew')

        expect(res.config.headers["x-token"]).toBe('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2NjFiMGMxNWQ0ZDViYTI3MGIwMWUzMWYiLCJuYW1lIjoiVGVzdCBVc2VyIiwiaWF0IjoxNzEzMDUxMjE1LCJleHAiOjE3MTMwNTg0MTV9.vNAVENDy6GdGGTjH8idefxhm_7bat4osrDqB0qxr9L8')


    })
})