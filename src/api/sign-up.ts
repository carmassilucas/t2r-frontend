import { api } from "@/lib/axios"

export interface CreateInterlocutorBody {
  name: string,
  aboutMe: string,
  email: string,
  password: string,
  dateOfBirth: string,
  currentState: string,
  currentCity: string,
  interlocutorType: string
}

export async function createInterlocutor({
  name,
  aboutMe,
  email,
  password,
  dateOfBirth,
  currentCity,
  currentState,
  interlocutorType
}: CreateInterlocutorBody) {
  await api.post("/interlocutor", {
    name,
    aboutMe,
    email,
    password,
    dateOfBirth,
    currentCity,
    currentState,
    interlocutorType
  });
}
