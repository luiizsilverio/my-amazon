import { useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { getError } from '../utils/error';
import Layout from '../components/Layout';

export default function ProfileScreen() {
  const { data: session } = useSession();

  const {
    handleSubmit,
    register,
    getValues,
    setValue,
    formState: { errors }
  } = useForm()


  const submitHandler = async({ name, email, password }) => {
    try {
      await axios.put('/api/auth/update', {
        name,
        email,
        password
      });

      const result = await signIn('credentials', {
        redirect: false,
        email,
        password: password || session.user.password,
      });

      toast.success('Conta atualizada com sucesso');

      if (result.error) {
        toast.error(result.error);
      }

    } catch (err) {
      toast.error(getError(err));
    }
  }


  useEffect(() => {
    setValue('name', session.user.name);
    setValue('email', session.user.email);
  }, [session.user, setValue]);


  return (
    <Layout title="Minha Conta">
      <form
        className='mx-auto max-w-screen-md'
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-xl font-semibold">Minha Conta</h1>
        <div className="mb-4">
          <label htmlFor="name">Nome</label>
          <input
            id="name"
            type="text"
            className='w-full'
            autoFocus
            {...register('name', {
              required: 'Nome obrigatório',
            })}
          />
          {errors.name && (
            <div className="text-red-500">{ errors.name.message} </div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            className='w-full'
            {...register('email', {
              required: 'E-mail obrigatório',
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                message: 'E-mail inválido'
              }
            })}
          />
          {errors.email && (
            <div className="text-red-500">{ errors.email.message} </div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            className='w-full'
            {...register('password', {
              minLength: { value: 6, message: 'Digite ao menos 6 letras' }
            })}
          />
          {errors.password && (
            <div className="text-red-500">{errors.password.message} </div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="confirmPassword">Confirme a Senha</label>
          <input
            id="confirmPassword"
            type="password"
            className='w-full'
            {...register('confirmPassword', {
              validate: (value) => value === getValues('password'),
              minLength: {
                value: 6,
                message: 'Digite ao menos 6 letras'
              }
            })}
          />
          {errors.confirmPassword && (
            <div className="text-red-500">{errors.confirmPassword.message}</div>
          )}
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

ProfileScreen.auth = true;