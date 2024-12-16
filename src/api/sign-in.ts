import { api } from "@/lib/axios";

export interface SignInBody {
  email: string;
  password: string;
}

export interface SignInResponse {
  access_token: string;
  expires_in: number;
}

export async function signIn({ email, password }: SignInBody): Promise<SignInResponse> {
  return (await api.post<SignInResponse>('/interlocutor/auth', { email, password })).data;
}
