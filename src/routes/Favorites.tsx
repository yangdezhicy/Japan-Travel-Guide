import { useState } from 'react'
import Modal from '../components/common/Modal'
import {
  EventDetailContent,
  FoodDetailContent,
  SouvenirDetailContent,
  SpotDetailContent,
} from '../components/common/DetailPanels'
import FavoritesPage from '../components/favorites/FavoritesPage'

export default function Favorites() {
  const [spotName, setSpotName] = useState<string>('')
  const [foodId, setFoodId] = useState<string>('')
  const [souvenirId, setSouvenirId] = useState<string>('')
  const [eventTitle, setEventTitle] = useState<string>('')

  const closeAll = () => {
    setSpotName('')
    setFoodId('')
    setSouvenirId('')
    setEventTitle('')
  }

  const openSpot = (name: string) => {
    closeAll()
    setSpotName(name)
  }

  const openFood = (id: string) => {
    closeAll()
    setFoodId(id)
  }

  const openSouvenir = (id: string) => {
    closeAll()
    setSouvenirId(id)
  }

  const openEvent = (title: string) => {
    closeAll()
    setEventTitle(title)
  }

  return (
    <>
      <FavoritesPage
        onOpenSpot={openSpot}
        onOpenFood={openFood}
        onOpenSouvenir={openSouvenir}
        onOpenEvent={openEvent}
      />

      <Modal id="fav-spot-modal" open={Boolean(spotName)} onClose={() => setSpotName('')} maxWidth="md:max-w-5xl" innerClassName="overflow-hidden">
        <SpotDetailContent name={spotName} onClose={() => setSpotName('')} />
      </Modal>

      <Modal id="fav-food-modal" open={Boolean(foodId)} onClose={() => setFoodId('')} maxWidth="md:max-w-4xl">
        <FoodDetailContent foodId={foodId} onClose={() => setFoodId('')} />
      </Modal>

      <Modal id="fav-sv-modal" open={Boolean(souvenirId)} onClose={() => setSouvenirId('')} maxWidth="md:max-w-4xl" innerClassName="overflow-hidden">
        <SouvenirDetailContent souvenirId={souvenirId} onClose={() => setSouvenirId('')} />
      </Modal>

      <Modal id="fav-event-modal" open={Boolean(eventTitle)} onClose={() => setEventTitle('')} maxWidth="md:max-w-4xl" innerClassName="overflow-hidden">
        <EventDetailContent title={eventTitle} onClose={() => setEventTitle('')} onOpenSpot={openSpot} />
      </Modal>
    </>
  )
}
