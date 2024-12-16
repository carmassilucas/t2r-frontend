import { api } from "@/lib/axios";

export interface GetProfileResponse {
  id: string,
  name: string,
  aboutMe: string,
  email: string,
  interlocutorType: "refugee" | "immigrant" | "collaborator"
  dateOfBirth: Date,
  currentState: string,
  currentCity: string,
  profilePicture: string | null
}

export async function getProfile() {
  return (await api.get<GetProfileResponse>("/interlocutor/profile")).data
}