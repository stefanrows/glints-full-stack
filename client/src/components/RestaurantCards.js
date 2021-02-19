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

const StyledInput = styled.input`
  margin: 0 10px 0 10px;
  height: 30px;
  font-size: 1rem;
`

const StyledButton = styled.input`
  margin: 0 10px 0 10px;
  height: 30px;
  width: 100px;
  background-color: white;
  display: inline-block;
  border: 1px solid black;
  border-radius: 5%;
  text-decoration: none;
  color: black;
  text-align: center;
  transition: all 0.2s;
  cursor: pointer;
  font-weight: bold;
  &:hover {
    color: white;
    background-color: black;
  }
`
const RestaurantDisplay = styled.div`
  margin-top: 2rem;
  max-width: 75%;
`

const RestaurantName = styled.h3`
  margin-bottom: 5px;
  text-align: center;
`

export const RestaurantCards = () => {
  // States
  const [time, setTime] = useState('00:00')
  const [date, setDate] = useState(new Date().toISOString())
  const [searchResults, setSearchResults] = useState([])
  const [searchComplete, setSearchComplete] = useState(false)
  const [searching, setSearching] = useState(false)
  // Submit Handler
  async function handleSubmit(e) {
    setSearchComplete(false)
    setSearchResults([])
    setSearching(true)
    e.preventDefault()
    console.log('Submitting')

    //Time conversion
    const [hoursString, minutesString] = time.split(':')
    const hours = parseInt(hoursString, 10)
    //12.15 === 12.25
    const minutes = parseInt(minutesString, 10) / 60
    // Payload data that gets send to backend
    const payload = {
      startTime: hours + minutes,
      date,
    }

    const requestPayload = {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(payload),
    }
    // Send Data to Backend and wait for it to come back
    const response = await fetch('http://localhost:5000/', requestPayload)
    // Data comes back from backend as data
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
        {/*listen for changes to the input value // When there is a change,
        set state to the new value // my input value is this updated state //
        using controlled inputs in React */}
        <StyledInput type='date' value={date} onChange={handleDateOnChange} />
        <StyledInput type='time' onChange={handleTimeOnChange} value={time} />
        <StyledButton type='submit' />
      </form>
      {searching && <h4>Fetching results...</h4>}
      {searchComplete && (
        <strong>{`Total Results found ${searchResults.length}`}</strong>
      )}
      {/* Render search results */}
      {searchResults.map((result, index) => {
        return (
          <Result key={index} name={result.name} hours={result.hours_string} />
        )
      })}
    </Container>
  )
}

// Result component

function Result(props) {
  return (
    <RestaurantDisplay>
      <RestaurantName>{props.name} </RestaurantName>
      <p>{props.hours}</p>
    </RestaurantDisplay>
  )
}
