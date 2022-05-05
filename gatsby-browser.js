import React from "react"
import { ThemeProvider as EmotionThemeProvider } from "emotion-theming"
import theme from "styles/theme"
import ThemeTogglerContext, { ThemeToggler } from "components/context/theme"

export const wrapRootElement = ({ element }) => {
  return (
    <ThemeToggler>
      <ThemeTogglerContext.Consumer>
        {({ themeName }) => (
          <EmotionThemeProvider theme={theme[themeName]}>
            {element}
          </EmotionThemeProvider>
        )}
      </ThemeTogglerContext.Consumer>
    </ThemeToggler>
  )
}
