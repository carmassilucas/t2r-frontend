import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import LocationContext from "@/contexts/LocationContext";
import { useContext, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { z } from "zod";
import { findInterlocutorsByFilter } from "@/api/find-by-filters"
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

const searchForm = z.object({
  currentState: z.string(),
  currentCity: z.string(),
  name: z.string(),
})

type SearchForm = z.infer<typeof searchForm>

export function Search() {
  const { register, handleSubmit, setValue, formState: { isSubmitting } } = useForm<SearchForm>()
  const { cities, states, selectedState, setSelectedState } = useContext(LocationContext)
  const [searchName, setSearchName] = useState<string>("");

  const { mutateAsync: search } = useMutation({
    mutationFn: findInterlocutorsByFilter
  })

  async function handleSearch(data: SearchForm) {
    const interlocutors = await search({
      currentState: data.currentState ? data.currentState : null,
      currentCity: data.currentCity ? data.currentCity : null,
      name: data.name ? data.name : null
    })
  }

  return (
    <>
      <Helmet title="Procurar Pessoas" />
      <div className="w-full flex justify-center p-4">
        <div className="w-full md:w-2/3">
          {/* Filtros */}
          <div className="flex items-center mb-6 space-x-4">
            <div className="w-24">
              <Select {...register('currentState')} onValueChange={value => {
                setSelectedState(value)
                setValue('currentState', value)
              }}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  {states.map(state => (<SelectItem key={state.sigla} value={state.sigla}>{state.sigla}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-64">
              <Select {...register('currentCity')} onValueChange={value => {
                setValue('currentCity', value)
              }}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Cidade" />
                </SelectTrigger>
                <SelectContent>
                  { cities.map(city => (<SelectItem key={city.nome} value={city.nome}>{city.nome}</SelectItem>)) }
                </SelectContent>
              </Select>
            </div>

            <Input className="w-96" value={searchName} onChange={(e) => setSearchName(e.target.value)} placeholder="Nome"/>

            <Button variant="ghost" className="p-2" aria-label="Limpar Filtros">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
