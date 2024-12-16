import { useForm } from 'react-hook-form';
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { signIn, SignInResponse } from '@/api/sign-in';
import { toast } from 'sonner';
import Cookies from "js-cookie";

const signInForm = z.object({
  email: z.string().email(),
  password: z.string()
})

type SignInForm = z.infer<typeof signInForm>

export function SignIn() {
  const [ searchParams ] = useSearchParams()

  const navigate = useNavigate();

  const { register, handleSubmit, formState: { isSubmitting } } = useForm<SignInForm>({
    defaultValues: {
      email: searchParams.get("email") ?? ""
    }
  })

  const { mutateAsync: authenticate } = useMutation<SignInResponse, Error, SignInForm>({
    mutationFn: signIn
  });

  async function handleSignIn(data: SignInForm) {
    try {
      const response = await authenticate({ email: data.email, password: data.password })

      Cookies.set('auth', response.access_token, {})

      navigate("/")
    } catch(err) {
      toast.error('Credenciais inválidas.')
    }
  }

  return (
    <>
      <Helmet title="Entrar" />

      <div className="p-8">
        <div className="w-[350px] flex flex-col justify-center gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tighter">Acessar bate-papo</h1>
            <p className="text-sm text-muted-foreground">Converse com refugiados e imigrantes na sua região!</p>
          </div>
          
          <form onSubmit={handleSubmit(handleSignIn)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" placeholder="Entre com seu e-mail" {...register('email')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" placeholder="Entre com sua senha" {...register('password')} />
            </div>

            <Button disabled={isSubmitting} className="w-full" type="submit">Acessar</Button>
          </form>

          <div className="flex flex-col gap-2 text-center">
            <p className="text-sm text-muted-foreground">
              Ainda não tem uma conta?{' '}
              <Link to="/sign-up" className="text-foreground font-semibold hover:underline">Cadastre-se</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}