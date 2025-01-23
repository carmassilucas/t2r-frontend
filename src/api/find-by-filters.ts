import { api } from "@/lib/axios";

export interface FindByFiltersBody {
  currentState: string | null,
  currentCity: string | null,
  name: string | null
}

export interface FindByFiltersResponse {
  id: string;
  name: string;
  aboutMe: string;
  interlocutorType: {
    id: number;
    description: "refugee" | "immigrant" | "collaborator";
  };
  currentState: string;
  currentCity: string;
  profilePicture: string | null;
}

export async function findInterlocutorsByFilter({
  currentState,
  currentCity,
  name
}: FindByFiltersBody) {
  const data = (await api.get<FindByFiltersResponse>("/interlocutor", {
    params: {
      currentState,
      currentCity,
      name
    }
  })).data;

  console.log(data)

  return 
}
