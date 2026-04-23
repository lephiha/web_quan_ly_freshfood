import ReactDOM from 'react-dom/client';
import { Suspense, StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LoginContextProvider } from './store/loginContext';
import { LangContextProvider } from './store/langContext';
import App from './app';

// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <LangContextProvider>
      <LoginContextProvider>
        <HelmetProvider>
          <BrowserRouter>
            <Suspense>
              <App />
            </Suspense>
          </BrowserRouter>
        </HelmetProvider>
      </LoginContextProvider>
    </LangContextProvider>
  </StrictMode>
);
