import { api } from "@/lib/axios";

interface UpdateInterlocutorBody {
  name: string,
  aboutMe: string,
  dateOfBirth: string,
  currentState: string,
  currentCity: string
}

export async function updateProfile({
  name,
  aboutMe,
  dateOfBirth,
  currentState,
  currentCity
}: UpdateInterlocutorBody) {
  await api.put("/interlocutor", {
    name,
    aboutMe,
    dateOfBirth,
    currentState,
    currentCity
  })
}