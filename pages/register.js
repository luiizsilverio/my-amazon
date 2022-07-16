import { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import Layout from "../components/Layout";
import { getError } from '../utils/error';
import axios from "axios";

export default function RegisterScreen() {
  const { register, handleSubmit, getValues, formState: { errors } } = useForm();
  const { data: session } = useSession();
  const router = useRouter();
  const { redirect } = router.query;

  const submitHandler = async({ name, email, password }) => {
    try {
      await axios.post('/api/auth/signup', {
        name,
        email,
        password
      })

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
    <Layout title="Criar Conta">
      <form className="mx-auto max-w-screen"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-xl font-semibold">Criar Conta</h1>
        <div className="mb-4">
          <label htmlFor="email">Nome</label>
          <input type="text" id="name" className="w-full" autoFocus
            {...register('name', {
              required: 'Digite o nome',
            })}
          />
          {errors.email &&
            <div className="text-red-500">{errors.name.message}</div>
          }
        </div>
        <div className="mb-4">
          <label htmlFor="email">E-mail</label>
          <input type="email" id="email" className="w-full"
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
              minLength: { value: 6, message: 'Digite senha acom mais de 5 letras' }
            })}
          />
          {errors.password &&
            <div className="text-red-500">{errors.password.message}</div>
          }
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword">Confirme a Senha</label>
          <input type="password" id="confirmPassword"
            className="w-full"
            {...register('confirmPassword', {
              required: 'Digite a senha',
              validate: (value) => value === getValues('password'),
              minLength: { value: 6, message: 'Digite senha com mais de 5 letras' }
            })}
          />
          {errors.confirmPassword &&
            errors.confirmPassword.type === 'validate' && (
              <div className="text-red-500">Senhas não conferem</div>
            )}
        </div>
        <div className="mb-4">
          <button className="primary-button">Confirma</button>
        </div>
      </form>
    </Layout>
  )
}