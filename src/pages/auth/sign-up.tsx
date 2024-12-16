import { useForm } from 'react-hook-form';
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from 'react-router-dom';
import { Textarea } from '@/components/ui/textarea';
import { useContext } from 'react';
import LocationContext from '@/contexts/LocationContext';
import { DatePicker } from '@/components/custom-date-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useMutation } from '@tanstack/react-query';
import { createInterlocutor } from '@/api/sign-up';
import { toast } from 'sonner';
import { format } from 'date-fns';

const signUpForm = z.object({
  name: z.string().min(2),
  aboutMe: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(2),
  dateOfBirth: z.date(),
  currentState: z.string().min(2).max(2),
  currentCity: z.string().min(2),
  interlocutorType: z.enum(["refugee", "immigrant", "collaborator"])
})

type SignUpForm = z.infer<typeof signUpForm>

export function SignUp() {
  const { register, handleSubmit, setValue, formState: { isSubmitting } } = useForm<SignUpForm>()
  const { cities, states, selectedState, setSelectedState } = useContext(LocationContext)
  const navigate = useNavigate();

  const { mutateAsync: create } = useMutation({
    mutationFn: createInterlocutor
  })

  async function handleSignIn(data: SignUpForm) {
    try {
      await create({
        name: data.name,
        aboutMe: data.aboutMe,
        email: data.email,
        password: data.password,
        dateOfBirth: format(data.dateOfBirth, "yyyy-MM-dd"),
        currentState: data.currentState,
        currentCity: data.currentCity,
        interlocutorType: data.interlocutorType
      })

      toast.success("Cadastro realizado com sucesso", {
        action: {
          label: "Entrar",
          onClick: () => navigate(`/sign-in?email=${data.email}`)
        }
      })
    } catch(error: any) {
      toast.error(error.response.data.title)
    }
  }

  return (
    <>
      <Helmet title="Cadastrar-se" />
      <div className="p-8">
        <div className="w-[512px] flex flex-col justify-center gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tighter">Criar conta</h1>
            <p className="text-sm text-muted-foreground">
              Converse com refugiados e imigrantes na sua região!
            </p>
          </div>
  
          <form onSubmit={handleSubmit(handleSignIn)} className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-[5] space-y-2">
                <Label htmlFor="text" className="pl-2">Nome</Label>
                <Input id="name" type="text" placeholder="Entre com seu nome" {...register('name')} />
              </div>
              <div className="flex-[3] space-y-2">
                <Label htmlFor="text" className="pl-2">Data de nascimento</Label>
                <DatePicker onDateChange={(date: Date) => setValue('dateOfBirth', date)}/>
              </div>
            </div>
  
            <div className="space-y-2">
              <Label htmlFor="text" className="pl-2">Sobre mim</Label>
              <Textarea id="aboutMe" placeholder="Fale um pouco sobre você" {...register('aboutMe')} />
            </div>
  
            <div className='flex justify-between gap-2'>
              <div className="space-y-2 w-32">
                <Label htmlFor="state" className="pl-2">Estado</Label>
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
  
              <div className="space-y-2 flex-1">
                <Label htmlFor="text" className="pl-2">Cidade</Label>
                <Select {...register('currentCity')} disabled={!selectedState} onValueChange={value => {
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
            </div>
  
            <div className="space-y-2">
              <Label htmlFor="text" className="pl-2">Perfil</Label>
              <Select {...register('interlocutorType')} required onValueChange={value => {
                  setValue('interlocutorType', value as 'refugee' | 'immigrant' | 'collaborator')
                }}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione perfil de usuário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="refugee">Refugiado</SelectItem>
                  <SelectItem value="immigrant">Imigrante</SelectItem>
                  <SelectItem value="collaborator">Colaborador</SelectItem>
                </SelectContent>
              </Select>
            </div>
  
            <div className="flex gap-2">
              <div className="flex-1 space-y-2">
                <Label htmlFor="email" className="pl-2">E-mail</Label>
                <Input id="email" type="email" placeholder="Entre com seu e-mail" {...register('email')} />
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor="password" className="pl-2">Senha</Label>
                <Input id="password" type="password" placeholder="Crie sua senha" {...register('password')} />
              </div>
            </div>
  
            <Button disabled={isSubmitting} className="w-full" type="submit">
              Finalizar Cadastro
            </Button>
          </form>
  
          <div className="gap-2 text-center">
            <p className="text-sm text-muted-foreground">
              Já possui uma conta?{' '}
              <Link to="/sign-in" className="text-foreground font-semibold hover:underline">
                Entrar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )  
}
