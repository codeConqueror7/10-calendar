import { render, screen } from "@testing-library/react"
import { FabDelete } from "../../../src/calendar"
import { Provider } from 'react-redux'
import { store } from "../../../src/store"

describe('prueba en <FabDelete />', () => {

    test('should debe de mostrar el componente correctamente ', () => {

        render(
            <Provider store={store}>
                <FabDelete/>
            </Provider>
        )
        screen.debug()
    })
})