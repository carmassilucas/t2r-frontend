import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { DatePicker } from './custom-date-picker';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { getProfile, GetProfileResponse } from '@/api/get-profile';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useContext } from 'react';
import LocationContext from '@/contexts/LocationContext';
import { updateProfile } from '@/api/update-profile';
import { format } from 'date-fns';
import { toast } from 'sonner';

const updateProfileSchema = z.object({
  name: z.string().min(2),
  aboutMe: z.string().min(2),
  dateOfBirth: z.date(),
  currentState: z.string().min(2).max(2),
  currentCity: z.string().min(2)
})

type UpdateProfileSchema = z.infer<typeof updateProfileSchema>

export function UpdateProfileDialog() {
  const { cities, states, selectedState, setSelectedState } = useContext(LocationContext)
  const queryClient = useQueryClient()

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile
  })

  const { register, handleSubmit, setValue, formState: { isSubmitting } } = useForm<UpdateProfileSchema>({
    resolver: zodResolver(updateProfileSchema),
    values: {
      name: profile?.name ?? "",
      aboutMe: profile?.aboutMe ?? "",
      dateOfBirth: new Date(profile?.dateOfBirth ?? ""),
      currentState: profile?.currentState ?? "",
      currentCity: profile?.currentCity ?? ""
    }
  })

  function updateProfileCache({name, aboutMe, dateOfBirth, currentState, currentCity}: UpdateProfileSchema) {
    const cached = queryClient.getQueryData<GetProfileResponse>(["profile"])

    if (cached) {
      queryClient.setQueryData<GetProfileResponse>(["profile"], {
        ...cached,
        name,
        aboutMe,
        dateOfBirth: new Date(dateOfBirth),
        currentState,
        currentCity
      })
    }

    return { cached }
  }

  const { mutateAsync: update } = useMutation({
    mutationFn: updateProfile,
    onMutate({ name, aboutMe, dateOfBirth, currentState, currentCity }) {
      const { cached } = updateProfileCache({ name, aboutMe, dateOfBirth: new Date(dateOfBirth), currentState, currentCity })

      return { previousProfile: cached }
    },
    onError(_, __, context) {
      if (context?.previousProfile) {
        updateProfileCache(context?.previousProfile)
      }
    },
  })

  async function handleUpdateProfile(data: UpdateProfileSchema) {
    try {
      await update({
        name: data.name,
        aboutMe: data.aboutMe,
        dateOfBirth: format(data.dateOfBirth, "yyyy-MM-dd"),
        currentState: data.currentState,
        currentCity: data.currentCity
      })

      toast.success("Informações atualizadas com sucesso")
    } catch {
      toast.error("Falha ao atualizar o perfil, tente novamente")
    }
  }

  setSelectedState(profile?.currentState ?? "")

  return (
    <DialogContent className="rounded-lg shadow-lg p-6">
      <DialogHeader>
        <DialogTitle>Perfil do usuário</DialogTitle>  
        <DialogDescription>Preencha apenas as informações que deseja alterar.</DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(handleUpdateProfile)}>
        <div className="flex gap-2 my-4">
          <div className="flex-[5] space-y-2">
            <Label htmlFor="text" className="pl-2">Nome</Label>
            <Input id="name" type="text" placeholder="Entre com seu nome" {...register('name')} />
          </div>
          <div className="flex-[3] space-y-2">
            <Label htmlFor="text" className="pl-2">Data de nascimento</Label>
            <DatePicker {...register('dateOfBirth')} selectedDate={profile?.dateOfBirth} />
          </div>
        </div>

        <div className="space-y-2 my-4">
          <Label htmlFor="text" className="pl-2">Sobre mim</Label>
          <Textarea id="aboutMe" placeholder="Fale um pouco sobre você" {...register('aboutMe')} className="min-h-40"/>
        </div>

        <div className='flex justify-between gap-2 my-4'>
          <div className="space-y-2 w-32">
            <Label htmlFor="state" className="pl-2">Estado</Label>
            <Select {...register('currentState')} onValueChange={value => {
              setSelectedState(value)
              setValue('currentState', value)
            }}
            defaultValue={profile?.currentState}>
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
            }}
            defaultValue={profile?.currentCity}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Cidade" />
              </SelectTrigger>
              <SelectContent>
                { cities.map(city => (<SelectItem key={city.nome} value={city.nome}>{city.nome}</SelectItem>)) }
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="ghost">Cancelar</Button>
          </DialogClose>
          <Button type="submit" variant="success" disabled={isSubmitting}>Salvar</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
