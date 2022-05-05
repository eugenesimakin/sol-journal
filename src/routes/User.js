import React from "react"
import styled from "@emotion/styled"
import { withTheme } from "emotion-theming"
import { compose } from "recompose"
import { format } from "date-fns"
import { BeatLoader } from "react-spinners"

import { SIZES } from "styles/constants"
import { getAllEntries, doSendEmailVerification, doPasswordReset } from '../fire'
import { withAuthentication } from "components/session"
import SignOut from "components/SignOut"
import { Button } from "components/elements"

const ProfileGrid = styled.div`
  display: grid;
  grid-template-rows: 1fr;
  grid-gap: 10px;
  margin-top: 20px;
`
const ProfileSection = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
`
const ProfileSectionHeader = styled.h2`
  font-size: ${SIZES.normal};
  color: ${props => props.theme.colors.tertiary};
`
const ProfileSectionText = styled.span`
  font-size: ${SIZES.normal};
  color: ${props => props.theme.colors.secondary};
`

class User extends React.Component {
  state = {
    files: [],
    exporting: false,
  }

  clearFiles = () => {
    if (this.state.files.length) {
      this.state.files.forEach(({ data }) => {
        window.URL.revokeObjectURL(data)
      })
    }
  }

  prepareExport = async () => {
    try {
      this.clearFiles()

      this.setState({ exporting: true, files: [] })

      const { authUser } = this.props

      const data = await getAllEntries(authUser.uid)
      const blob = new Blob([JSON.stringify(data)], {
        type: "text/json;charset=utf-8",
      })

      const file = {
        name: `journal-export-${format(new Date(), "MMDDYYYY")}.json`,
        data: window.URL.createObjectURL(blob),
      }
      this.setState({ files: [file], exporting: false })
    } catch (e) {
      window.alert(
        "Your export ran into an issue, sorry :( if you continue to have problmes you can reach out to kylerobertgill@gmail.com"
      )
      console.error(e)
      this.setState({ files: [], exporting: 0 })
    }
  }

  render() {
    const { authUser, theme } = this.props
    const { exporting, files } = this.state
    return (
      <ProfileGrid>
        <ProfileSection>
          <ProfileSectionHeader>
            User: <ProfileSectionText>{authUser.email}</ProfileSectionText>
            <div>
              <ProfileSectionText style={{ fontWeight: 400 }}>
                {authUser.emailVerified ? (
                  "Email has been verified"
                ) : (
                  <span>
                    Email not verified{" "}
                    <span
                      onClick={() => {
                        doSendEmailVerification()
                      }}
                    >
                      Resend?
                    </span>
                  </span>
                )}
              </ProfileSectionText>
            </div>
          </ProfileSectionHeader>
          <SignOut />
        </ProfileSection>
        <ProfileSection>
          <ProfileSectionHeader>
            Reset Password{" "}
            <div>
              <ProfileSectionText style={{ fontWeight: 400 }}>
                send an email with reset instructions
              </ProfileSectionText>
            </div>
          </ProfileSectionHeader>

          <Button
            fontSize="small"
            colors={theme.colors}
            onClick={() => {
              doPasswordReset(authUser.email)
            }}
          >
            Send Reset
          </Button>
        </ProfileSection>
        <ProfileSection>
          <ProfileSectionHeader>
            Export Journal Entries{" "}
            <div>
              <ProfileSectionText style={{ fontWeight: 400 }}>
                download all journal entries into a JSON file
              </ProfileSectionText>
            </div>
          </ProfileSectionHeader>
          {files.length ? (
            <a
              download={files[0].name}
              href={files[0].data}
              style={{ textDecoration: "none" }}
            >
              <Button
                fontSize="small"
                colors={theme.colors}
                onClick={() => {
                  setTimeout(() => {
                    this.clearFiles()
                    this.setState({ exporting: 0, files: [] })
                  }, 1500)
                }}
              >
                Download
              </Button>
            </a>
          ) : (
            <Button
              fontSize="small"
              colors={theme.colors}
              onClick={() => this.prepareExport()}
            >
              {exporting ? (
                <BeatLoader
                  color={theme.colors.secondary}
                  size={10}
                  margin="4px"
                />
              ) : (
                "Export"
              )}
            </Button>
          )}
        </ProfileSection>
      </ProfileGrid>
    )
  }
}

export default compose(
  withAuthentication,
  withTheme
)(User)
