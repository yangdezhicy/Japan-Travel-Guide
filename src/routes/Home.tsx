import { useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import {
  findEventByTitle,
  findFoodById,
  findSpotByName,
  REGIONS,
} from '../data/index'
import type { RegionId, SeasonKey } from '../data/types'
import Modal from '../components/common/Modal'
import {
  EventDetailContent,
  FoodDetailContent,
  IntroDetailContent,
  SeasonDetailContent,
  SouvenirDetailContent,
  SpotDetailContent,
} from '../components/common/DetailPanels'
import Cta from '../components/home/Cta'
import Destinations from '../components/home/Destinations'
import Events from '../components/home/Events'
import Food from '../components/home/Food'
import Hero from '../components/home/Hero'
import IntroStats from '../components/home/IntroStats'
import Seasons from '../components/home/Seasons'
import Tips from '../components/home/Tips'
import TravelTools from '../components/home/TravelTools'
import Videos from '../components/home/Videos'

function scrollToSection(sectionId: string): void {
  window.setTimeout(() => {
    if (sectionId === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    const target = document.getElementById(sectionId)
    if (target) {
      const navHeight = document.getElementById('nav')?.getBoundingClientRect().height ?? 64
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 8
      window.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' })
    }
  }, 80)
}

export default function Home() {
  const location = useLocation()
  const [activeRegionId, setActiveRegionId] = useState<RegionId>(REGIONS[0].id)
  const [introIndex, setIntroIndex] = useState<number | null>(null)
  const [seasonKey, setSeasonKey] = useState<SeasonKey | ''>('')
  const [spotName, setSpotName] = useState<string>('')
  const [foodId, setFoodId] = useState<string>('')
  const [souvenirId, setSouvenirId] = useState<string>('')
  const [eventTitle, setEventTitle] = useState<string>('')

  const closeAll = useCallback(() => {
    setIntroIndex(null)
    setSeasonKey('')
    setSpotName('')
    setFoodId('')
    setSouvenirId('')
    setEventTitle('')
  }, [])

  const openIntro = useCallback((index: number) => {
    closeAll()
    setIntroIndex(index)
  }, [closeAll])

  const openSeason = useCallback((key: SeasonKey) => {
    closeAll()
    setSeasonKey(key)
  }, [closeAll])

  const openSpot = useCallback((name: string) => {
    const hit = findSpotByName(name)
    if (hit?.region?.id) setActiveRegionId(hit.region.id)
    closeAll()
    setSpotName(name)
  }, [closeAll])

  const openFood = useCallback((id: string) => {
    const hit = findFoodById(id)
    if (hit?.region?.id) setActiveRegionId(hit.region.id)
    closeAll()
    setFoodId(id)
  }, [closeAll])

  const openSouvenir = useCallback((id: string) => {
    closeAll()
    setSouvenirId(id)
  }, [closeAll])

  const openEvent = useCallback((title: string) => {
    const hit = findEventByTitle(title)
    if (hit?.region?.id) setActiveRegionId(hit.region.id)
    closeAll()
    setEventTitle(title)
  }, [closeAll])

  useEffect(() => {
    const search = new URLSearchParams(location.search)
    const section = search.get('section')
    const spot = search.get('spot')
    const food = search.get('food')
    const sv = search.get('sv')
    const event = search.get('event')

    if (section) {
      scrollToSection(section)
    }

    if (spot) openSpot(spot)
    else if (food) openFood(food)
    else if (sv) openSouvenir(sv)
    else if (event) openEvent(event)
  }, [location.search, openEvent, openFood, openSouvenir, openSpot])

  return (
    <main>
      <Hero />
      <IntroStats onOpenIntro={openIntro} />
      <Seasons onOpenSeason={openSeason} />
      <Destinations activeRegionId={activeRegionId} onChangeRegion={setActiveRegionId} onOpenSpot={openSpot} />
      <Food activeRegionId={activeRegionId} onOpenFood={openFood} />
      <Videos activeRegionId={activeRegionId} />
      <Events activeRegionId={activeRegionId} onChangeRegion={setActiveRegionId} onOpenEvent={openEvent} />
      <TravelTools />
      <Tips />
      <Cta />

      <Modal id="spot-modal" open={Boolean(spotName)} onClose={() => setSpotName('')} maxWidth="md:max-w-5xl" innerClassName="overflow-hidden">
        <SpotDetailContent name={spotName} onClose={() => setSpotName('')} />
      </Modal>

      <Modal id="food-modal" open={Boolean(foodId)} onClose={() => setFoodId('')} maxWidth="md:max-w-4xl">
        <FoodDetailContent foodId={foodId} onClose={() => setFoodId('')} />
      </Modal>

      <Modal id="sv-modal" open={Boolean(souvenirId)} onClose={() => setSouvenirId('')} maxWidth="md:max-w-4xl" innerClassName="overflow-hidden">
        <SouvenirDetailContent souvenirId={souvenirId} onClose={() => setSouvenirId('')} />
      </Modal>

      <Modal id="intro-modal" open={introIndex !== null} onClose={() => setIntroIndex(null)} maxWidth="md:max-w-5xl">
        <IntroDetailContent index={introIndex} onClose={() => setIntroIndex(null)} />
      </Modal>

      <Modal id="season-modal" open={Boolean(seasonKey)} onClose={() => setSeasonKey('')} maxWidth="md:max-w-5xl" innerClassName="overflow-hidden">
        <SeasonDetailContent seasonKey={seasonKey} onClose={() => setSeasonKey('')} />
      </Modal>

      <Modal id="event-modal" open={Boolean(eventTitle)} onClose={() => setEventTitle('')} maxWidth="md:max-w-4xl" innerClassName="overflow-hidden">
        <EventDetailContent title={eventTitle} onClose={() => setEventTitle('')} onOpenSpot={openSpot} />
      </Modal>
    </main>
  )
}
