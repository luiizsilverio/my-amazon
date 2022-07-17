import { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import Layout from "../components/Layout";
import { getError } from '../utils/error';

export default function LoginScreen() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { data: session } = useSession();
  const router = useRouter();
  const { redirect } = router.query;

  const submitHandler = async({ email, password }) => {
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })
      if (result.error) {
        toast.error(result.error);
      }
    } catch (err) {
        toast.error(getError(err));
    }
  }

  useEffect(() => {
    if (session?.user) {
      router.push(redirect || '/');
    }
  }, [router, session, redirect])

  return (
    <Layout title="Login">
      <form className="mx-auto max-w-screen"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-xl font-semibold">Login</h1>
        <div className="mb-4">
          <label htmlFor="email">E-mail</label>
          <input type="email" id="email" className="w-full" autoFocus
            {...register('email', {
              required: 'Digite o e-mail',
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                message: 'E-mail inválido'
              }
            })}
          />
          {errors.email &&
            <div className="text-red-500">{errors.email.message}</div>
          }
        </div>
        <div className="mb-4">
          <label htmlFor="password">Senha</label>
          <input type="password" id="password" className="w-full"
            {...register('password', {
              required: 'Digite a senha',
              minLength: { value: 6, message: 'Digite ao menos 6 letras' }
            })}
          />
          {errors.password &&
            <div className="text-red-500">{errors.password.message}</div>
          }
        </div>
        <div className="mb-4">
          <button className="primary-button">Login</button>
        </div>
        <div className="mb-4">
          Não possui uma conta? &nbsp;
          <Link href={`/register?redirect=${redirect || '/'}`}>
            Cadastre-se
          </Link>
        </div>
      </form>
    </Layout>
  )
}