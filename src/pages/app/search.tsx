import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import LocationContext from "@/contexts/LocationContext";
import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, X } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { FindByFiltersResponse, findInterlocutorsByFilter } from "@/api/find-by-filters";
import { createChat } from "@/api/create-chat";
import { useNavigate } from "react-router-dom";

export function Search() {
  const navigate = useNavigate();
  const { register, setValue, watch } = useForm();
  const { cities, states, selectedState, setSelectedState } = useContext(LocationContext);
  const [interlocutors, setInterlocutors] = useState<FindByFiltersResponse[]>([]);
  const [searchName, setSearchName] = useState<string>("");
  const [resetKey, setResetKey] = useState("");

  const { mutateAsync: search } = useMutation({
    mutationFn: findInterlocutorsByFilter,
  });

  const { mutateAsync: create } = useMutation({
    mutationFn: createChat,
  });

  const stateFilter = watch("currentState");
  const cityFilter = watch("currentCity");

  const fetchInterlocutors = async () => {
    const filters: any = {};

    if (stateFilter) filters.currentState = stateFilter;
    if (cityFilter) filters.currentCity = cityFilter;
    if (searchName) filters.name = searchName;

    const results = await search(filters);
    setInterlocutors(results || []);
  };

  useEffect(() => {
    fetchInterlocutors();
  }, []);

  useEffect(() => {
    fetchInterlocutors();
  }, [stateFilter, cityFilter, searchName]);

  const handleStartConversation = async (id : string) => {
    const chatId = await create({ id })
    navigate(`/${chatId}`);
  };

  return (
    <>
      <Helmet title="Procurar Pessoas" />
      <div className="w-full flex justify-center p-4">
        <div className="w-full md:w-2/3">
          <div className="flex items-center mb-6 space-x-4">
            <div className="w-24">
              <Select key={`state-${resetKey}`} {...register("currentState")} onValueChange={(value: string) => {
                setSelectedState(value);
                setValue("currentState", value);
              }}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state.sigla} value={state.sigla}>
                      {state.sigla}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-64">
              <Select key={`city-${resetKey}`} {...register("currentCity")} disabled={!selectedState}
                onValueChange={(value: string) => {
                  setValue("currentCity", value);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Cidade" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.nome} value={city.nome}>
                      {city.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Input className="w-96" value={searchName} onChange={(e) => setSearchName(e.target.value)} placeholder="Nome" />

            <Button variant="ghost" className="p-2" aria-label="Limpar Filtros" onClick={() => {
              setValue("currentState", "");
              setValue("currentCity", "");
              setSearchName("");
              setSelectedState("")
              setResetKey((prev) => prev + 1);
            }}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <ScrollArea className="h-[850px] pr-2.5 overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {interlocutors && interlocutors.length > 0 ? (
                interlocutors.map((user) => (
                  <Card key={user.id} className="relative p-4 flex flex-col max-h-96 space-y-4">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={user.profilePicture ?? ""} alt={`${user.name} Avatar`} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="text-xl font-semibold">{user.name}</h2>
                        <p className="text-muted-foreground">
                          {user.currentState}, {user.currentCity}
                        </p>
                      </div>
                    </div>
                    <div className="flex-1">
                      <ScrollArea className="h-32 overflow-y-auto">
                        <p className="text-muted-foreground">{user.aboutMe}</p>
                      </ScrollArea>
                    </div>
                    <Button
                      className="self-end mt-auto p-2 rounded-full"
                      variant="outline"
                      size="icon"
                      aria-label="Iniciar Chat"
                      onClick={() => handleStartConversation(user.id)}
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </Card>
                ))
              ) : (
                <p className="text-center text-muted-foreground col-span-full">
                  Nenhum perfil encontrado.
                </p>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </>
  );
}
