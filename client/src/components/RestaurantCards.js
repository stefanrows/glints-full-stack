import React, { useState } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
`

const PickerHeader = styled.h2`
  margin-top: 10px;
  margin-bottom: 25px;
  font-size: clamp(1.25rem, 3.5vw, 2rem);
`

const RestaurantDisplay = styled.div`
  margin-top: 2rem;
`

const StyledInput = styled.input`
  width: 200px;
  height: 30px;
  font-size: clamp(1rem, 3.5vw, 1.25rem);
`

export const RestaurantCards = () => {
  // const [todos, setTodos] = useState(initialTodos)
  const [time, setTime] = useState('00:00')
  const [date, setDate] = useState(new Date().toISOString())
  const [searchResults, setSearchResults] = useState([])
  const [searchComplete, setSearchComplete] = useState(false)
  const [searching, setSearching] = useState(false)
  async function handleSubmit(e) {
    setSearchComplete(false)
    setSearchResults([])
    setSearching(true)
    e.preventDefault()
    console.log('Submitting')

    /*
    const splitTime = time.split(':')
    const hoursString = splitTime[0]
    const minutesString = splitTime[1]
    */
    //Destructuring
    const [hoursString, minutesString] = time.split(':')
    const hours = parseInt(hoursString, 10)
    const minutes = parseInt(minutesString, 10) / 60
    console.log(hoursString, minutesString)
    // ?????
    const payload = {
      startTime: hours + minutes,
      date,
    }
    // ????
    const requestPayload = {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(payload),
    }

    // ????
    const response = await fetch('http://localhost:5000/', requestPayload)
    const data = await response.json()
    setSearchResults(data.data)
    setSearchComplete(true)
    setSearching(false)
  }

  function handleDateOnChange(e) {
    setDate(e.target.value)
  }

  function handleTimeOnChange(e) {
    setTime(e.target.value)
  }

  return (
    <Container>
      <PickerHeader>
        <i className='far fa-clock'></i> Pick A Date and Time
      </PickerHeader>
      <form onSubmit={handleSubmit}>
        {/* // I listen for changes to the input value // When there is a change I
        set state to the new value // my input value is this updated state //
        using controlled inputs in React */}
        <StyledInput type='date' value={date} onChange={handleDateOnChange} />
        <StyledInput type='time' onChange={handleTimeOnChange} value={time} />
        <StyledInput type='submit' />
      </form>
      {/* ?????? */}
      {searching && <h4>Fetching results...</h4>}
      {searchComplete && (
        <strong>{`Total Results found ${searchResults.length}`}</strong>
      )}
      {searchResults.map((result, index) => {
        console.log('hours', result.hours_string)
        return (
          <Result key={index} name={result.name} hours={result.hours_string} />
        )
      })}
    </Container>
  )
}

function Result(props) {
  return (
    <RestaurantDisplay>
      <strong>{props.name} </strong>
      <p>{props.hours}</p>
    </RestaurantDisplay>
  )
}

// 02:15 = 2.25
// Split into hours and minutes
// Convert minutes to decimals of hours
// Add them together
