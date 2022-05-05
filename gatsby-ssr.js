import React from "react"
import { ThemeProvider } from "emotion-theming"
import theme from "./src/styles/theme"

export const wrapRootElement = ({ element }) => (
  <ThemeProvider theme={theme.LIGHT}>{element}</ThemeProvider>
)
