import { ThemeProvider } from "styled-components";
import { GlobalStyles } from "./styles/GlobalStyles";
import { defaultTheme } from "./styles/themes/default";

export function App() {
  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <h1>Hello</h1>
        <GlobalStyles />
      </ThemeProvider>
    </>
  )
}

