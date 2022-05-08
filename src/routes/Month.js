import React, { Component } from "react"
import styled from "@emotion/styled"
import {
  isAfter,
  isThisYear,
  isThisMonth,
  format,
  addMonths,
  subMonths,
  getDaysInMonth,
  startOfMonth,
} from "date-fns"

import { SIZES } from "styles/constants"

import { AppLink as Link } from "components/elements"
import { withAuthentication } from "components/session"
import Seek from "components/Seek"
import { getDaysInMonthFilled } from "../fire"

const DayCardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  grid-gap: 20px;
  margin-top: 20px;
`
const DayCard = styled.div`
  color: ${props =>
    props.disabled
      ? props.theme.colors.quarternary
      : props.theme.colors.secondary};
  border: 1px solid;
  border-color: ${props => props.theme.colors.quarternary};
  border-radius: 5px;
  text-align: center;
  user-select: none;
  &:hover {
    border-color: ${props => !props.disabled && props.theme.colors.tertiary};
  }
`
const DayCardBanner = styled.div`
  font-size: ${SIZES.tiny};
  position: relative;
  top: -0px;
  background-color: ${props => props.theme.colors.headerBackground};
  border-bottom: 1px solid;
  border-bottom-color: ${props => props.theme.colors.quarternary};
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  padding: 5px 0px;
`
const DayCardContent = styled.div`
  padding: 20px 25px;
  font-weight: ${props => props.hasText ? 'bold' : 'normal'};
`

class Month extends Component {
  constructor(props) {
    super(props)
    this.state = { days: [] }
    this.highlightEntries = this.highlightEntries.bind(this)
  }

  componentDidMount() {
    this.highlightEntries()
  }

  componentDidUpdate(prevProps) {
    if (this.props.uri !== prevProps.uri) {
      this.highlightEntries()
    }
  }

  highlightEntries() {
    const { year, month, authUser } = this.props
    getDaysInMonthFilled(year, month, authUser.uid).then(days => {
      this.setState({ days })
    })
  }

  render() {
    const { year, month } = this.props
    const nowDate = new Date(year, month - 1)
    const daysHasText = this.state.days

    // include all months unless it's this year
    let dayIndexesToInclude = 31
    if (isThisYear(nowDate)) {
      dayIndexesToInclude = new Date().getDate()
    }

    let dayCards = []
    for (let i = 0; i < getDaysInMonth(nowDate); i++) {
      const isDisabled = dayIndexesToInclude <= i && isThisMonth(nowDate)
      if (isDisabled) {
        dayCards.push(
          <DayCard disabled={isDisabled} key={i}>
            <DayCardBanner>
              {format(new Date(year, month - 1, i + 1), "ddd")}
            </DayCardBanner>
            <DayCardContent>{i + 1}</DayCardContent>
          </DayCard>
        )
      } else {
        const hasText = daysHasText.includes(i + 1)
        dayCards.push(
          <Link
            key={i}
            to={format(new Date(year, month - 1, i + 1), "/YYYY/MM/DD")}
            style={{ textDecoration: "none" }}
          >
            <DayCard key={i}>
              <DayCardBanner>
                {format(new Date(year, month - 1, i + 1), "ddd")}
              </DayCardBanner>
              <DayCardContent hasText={hasText}>{i + 1}</DayCardContent>
            </DayCard>
          </Link>
        )
      }
    }

    return (
      <>
        <Seek
          title={format(nowDate, "YYYY MMM")}
          prev={format(subMonths(nowDate, 1), "/YYYY/MM")}
          next={format(addMonths(nowDate, 1), "/YYYY/MM")}
          disableNext={isAfter(
            nowDate,
            startOfMonth(subMonths(new Date(), 1))
          )}
        />
        <DayCardGrid>{dayCards}</DayCardGrid>
      </>
    )
  }
}

export default withAuthentication(Month)
