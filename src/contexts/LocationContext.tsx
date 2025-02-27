'use client'

import { createContext, ReactNode, useEffect, useState } from 'react'

import { locationApi } from '@/lib/axios'

interface State {
  id: number
  sigla: string
  nome: string
}

interface City {
  id: number
  nome: string
}

interface LocationType {
  states: State[]
  cities: City[]
  selectedState: string
  setSelectedState: (state: string) => void
}

const LocationContext = createContext({} as LocationType)

interface LocationProviderProps {
  children: ReactNode
}

export function LocationProvider({ children }: LocationProviderProps) {
  const [states, setStates] = useState([])
  const [selectedState, setSelectedState] = useState('')
  const [cities, setCities] = useState([])

  useEffect(() => {
    locationApi.get('/').then((response) => {
      const sortedStates = response.data.sort((a: State, b: State) =>
        a.sigla.localeCompare(b.sigla),
      )
      setStates(sortedStates)
    })
  }, [])

  useEffect(() => {
    if (selectedState) {
      locationApi.get(`/${selectedState}/municipios`).then((response) => {
        const sortedCities = response.data.sort((a: City, b: City) =>
          a.nome.localeCompare(b.nome),
        )
        setCities(sortedCities)
      })
    }
  }, [selectedState])

  return (
    <LocationContext.Provider value={{ states, cities, selectedState, setSelectedState }} >
      {children}
    </LocationContext.Provider>
  )
}

export default LocationContext