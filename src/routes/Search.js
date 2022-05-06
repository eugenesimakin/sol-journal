import { Component } from "react"
/** @jsx jsx */
import { jsx, css, keyframes } from "@emotion/core"
import styled from "@emotion/styled"
import { compose } from "recompose"
import { withTheme } from "emotion-theming"
import { BeatLoader } from "react-spinners"

import { AppLink as Link } from "components/elements"
import { Input } from "components/elements"
import { getLastEntries, getFilteredEntries } from "../fire"
import { withAuthentication } from "components/session"
import { pad } from "utils/date"

const SearchGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 10px;
  margin-bottom: 60px;
`
const SearchLayout = styled.div`
  width: 100%;
  align-self: center;
  margin-top: 20px;
`

const SearchResult = styled.div`
  margin-top: 5px;
  padding: 20px;
  border-radius: 5px;
  color: ${props => props.theme.colors.primary};
  border: 1px solid;
  border-color: ${props => props.theme.colors.quarternary};
  &:hover {
    cursor: pointer;
    border-color: ${props => props.theme.colors.tertiary};
  }
`

const fadeKeyFrames = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`
const LoadingSpinner = styled(BeatLoader)`
  opacity: 0;
`

class Search extends Component {
  state = {
    entries: [],
    allEntries: [],
    searchInput: "",
    loading: true,
  }

  componentDidMount() {
    this.getEntries()
  }

  onChange = event => {
    const searchInput = event.target.value
    this.setState({ searchInput })
    this.filterEntries(searchInput)
  }

  filterEntries = searchTerm => {
    const { allEntries } = this.state // allEntries = last 10 entries
    if (searchTerm === "") {
      this.setState({ entries: allEntries })
    } else {
      const { authUser } = this.props
      getFilteredEntries(authUser.uid, entry => {
        return entry.text.toLowerCase().includes(searchTerm.toLowerCase())
      }).then(filteredEntries => {
        this.setState({ entries: filteredEntries })
      })
    }
  }

  // todo: proper fulltext search
  getEntries = async _ => {
    const { authUser } = this.props
    getLastEntries(authUser.uid).then(entries => {
      this.setState({ entries, allEntries: entries, loading: false })
    })
  }

  render() {
    const { entries, searchInput, loading } = this.state
    const { theme } = this.props

    return (
      <SearchLayout>
        <SearchGrid>
          <Input
            autoFocus={true}
            value={searchInput}
            onChange={e => this.onChange(e)}
            type="text"
            placeholder="Search..."
            colors={theme.colors}
          />
          {loading ? (
            <div style={{ marginTop: 10, margin: "0 auto" }}>
              <LoadingSpinner
                color={theme.colors.quarternary}
                size={10}
                margin="4px"
                css={css`
                  animation: ${fadeKeyFrames} 1s ease-in;
                `}
              />
            </div>
          ) : entries.length > 0 ? (
            entries.map(
              (entry, index) =>
                entry.text.length > 1 && (
                  <Link
                    key={index}
                    to={`/${entry.year}/${pad(entry.month)}/${pad(entry.day)}`}
                    style={{ textDecoration: "none" }}
                  >
                    <SearchResult
                      css={css`
                        animation: ${fadeKeyFrames} 0.2s ease-in;
                      `}
                    >
                      <div
                        css={css`
                          font-style: italic;
                          color: ${theme.colors.secondary};
                          margin-bottom: 5px;
                        `}
                      >
                        {entry.day}/{entry.month}/{entry.year}
                      </div>
                      <div>
                        {entry.text.substring(0, 128)}
                        {entry.text.length >= 128 && "..."}
                      </div>
                    </SearchResult>
                  </Link>
                )
            )
          ) : (
            <div
              css={css`
                text-align: center;
                font-style: italic;
                color: ${theme.colors.tertiary};
                margin-top: 5px;
              `}
            >
              No entries to display
            </div>
          )}
        </SearchGrid>
      </SearchLayout>
    )
  }
}

export default compose(
  withTheme,
  withAuthentication
)(Search)
