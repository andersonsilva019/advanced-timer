import { ThemeProvider } from "styled-components";
import { GlobalStyles } from "./styles/GlobalStyles";
import { defaultTheme } from "./styles/themes/default";
import { Router } from "./Routes";
import { CycleContextProvider } from "./contexts/CycleContext";

export function App() {
  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <CycleContextProvider>
          <Router />
        </CycleContextProvider>
        <GlobalStyles />
      </ThemeProvider>
    </>
  )
}

