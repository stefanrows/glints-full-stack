import './App.css'
import { RestaurantCards } from './components/RestaurantCards.js'
import styled from 'styled-components'
import RestaurantImage from './media/Restaurant _Isometric.svg'

const Container = styled.div`
  display: flex;
  margin-left: auto;
  margin-right: auto;
  width: 80%;
  height: 100vh;
  flex-direction: column;
  align-items: center;
`

const Heading = styled.h1`
  font-family: 'Montserrat', sans-serif;
  margin-top: 5%;
  margin-bottom: 20px;
  font-size: clamp(2rem, 5vw, 3rem);
`

const ImgContainer = styled.img`
  max-height: 300px;
  max-width: 80%;
`

function App() {
  return (
    <Container>
      <Heading>Glints Open Hours</Heading>
      <ImgContainer src={RestaurantImage} alt='Logo' />
      <RestaurantCards />
    </Container>
  )
}

export default App
