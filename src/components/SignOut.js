import React from "react"
import { compose } from "recompose"
import { withTheme } from "emotion-theming"
import { navigate } from "gatsby"
import { Button } from "components/elements"

import { doSignOut } from "../fire"

const SignOutButton = ({ theme }) => (
  <Button
    fontSize="small"
    colors={theme.colors}
    type="button"
    onClick={() => doSignOut().then(() => navigate('/login'))}
  >
    Sign Out
  </Button>
)

export default compose(
  withTheme,
)(SignOutButton)
