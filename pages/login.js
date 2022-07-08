import Link from "next/link";
import Layout from "../components/Layout";
import { useForm } from "react-hook-form"

export default function LoginScreen() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const submitHandler = ({email, password}) => {

  }

  return (
    <Layout title="Login">
      <form className="mx-auto max-w-screen"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-xl">Login</h1>
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
              minLength: { value: 5, message: 'Digite ao menos 5 letras' }
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
          <Link href="register">Cadastre-se</Link>
        </div>
      </form>
    </Layout>
  )
}