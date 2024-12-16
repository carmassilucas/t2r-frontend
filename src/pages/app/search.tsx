import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import LocationContext from "@/contexts/LocationContext";
import { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

const usersData = [
  { 
    id: 1, 
    name: "Maria Silva", 
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vehicula risus et turpis sollicitudin rhoncus. Etiam quis ligula tortor. Sed lacus ex, facilisis non elementum vel, dictum dictum neque. Aliquam lobortis, urna sed dapibus tincidunt, sem metus elementum elit, a dictum metus mauris nec est. Sed imperdiet purus tortor, in convallis quam volutpat eu. Quisque egestas mattis velit, nec lobortis est accumsan pellentesque. Nullam tincidunt luctus ante ut lacinia. Curabitur cursus neque ac quam vestibulum volutpat. Vivamus id justo quis tellus viverra pharetra vel vitae augue.", 
    location: "São Paulo, SP", 
    avatar: "https://i.pravatar.cc/150?img=1" 
  },
  { 
    id: 2, 
    name: "Carlos Oliveira", 
    bio: "Engenheiro de Software", 
    location: "Rio de Janeiro, RJ", 
    avatar: "https://i.pravatar.cc/150?img=2" 
  },
  { 
    id: 3, 
    name: "Ana Souza", 
    bio: "Gerente de Projetos", 
    location: "Curitiba, PR", 
    avatar: "https://i.pravatar.cc/150?img=3" 
  },
];

export function Search() {
  const { cities, states, selectedState, setSelectedState } = useContext(LocationContext);

  const filteredUsers = usersData.filter((user) => {
    const matchesState = selectedState ? user.location.endsWith(selectedState) : true;
    return matchesState;
  });

  return (
    <>
      <Helmet title="Buscar Ajuda" />
      <div className="w-full flex justify-center p-4">
        <div className="w-full md:w-2/3">
          {/* Seletor de Estado e Cidade */}
          <div className="flex items-center mb-6 space-x-4">
            <div className="w-24">
              <Select onValueChange={value => { setSelectedState(value); }}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  {states.map(state => (
                    <SelectItem key={state.sigla} value={state.sigla}>
                      {state.sigla}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-64">
              <Select disabled={!selectedState}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Cidade" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map(city => (
                    <SelectItem key={city.nome} value={city.nome}>
                      {city.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Grid de Cards de Usuários */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <Card 
                  key={user.id} 
                  className="relative p-4 flex flex-col max-h-96 space-y-4 cursor-pointer"
                >
                  {/* Header com Avatar e Informações Básicas */}
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={user.avatar} alt={`${user.name} Avatar`} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-xl font-semibold">{user.name}</h2>
                      <p className="text-muted-foreground">{user.location}</p>
                    </div>
                  </div>

                  {/* Bio com Área de Rolagem */}
                  <div className="flex-1">
                    <ScrollArea className="h-32 overflow-y-auto">
                      <p className="text-muted-foreground">{user.bio}</p>
                    </ScrollArea>
                  </div>

                  {/* Botão de Chat */}
                  <Button
                    className="self-end mt-auto p-2 rounded-full"
                    variant="outline"
                    size="icon"
                    aria-label="Iniciar Chat"
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
        </div>
      </div>
    </>
  );
}
