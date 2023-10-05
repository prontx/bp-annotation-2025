
// theming
import { theme } from './style/theme'
import { ThemeProvider } from 'styled-components'

import Controls from "./components/compound/Controls"

function App() {
    return (
        <ThemeProvider theme={theme}>
            <Controls />
        </ThemeProvider>
    )
}

export default App
