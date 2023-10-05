import React from 'react'
import ReactDOM from 'react-dom/client'

// components
import App from './App.tsx'

// redux
import { Provider } from 'react-redux'
import { store } from './redux/store'

// styles
import { theme } from './style/theme'
import { ThemeProvider } from 'styled-components'
import './style/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <App />
            </ThemeProvider>
        </Provider>
    </React.StrictMode>,
)
