import { useContext, useEffect } from "react";
import { useRouter } from 'next/router';
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";

import CheckoutWizard, { checkout_steps } from "../components/CheckoutWizard";
import Layout from "../components/Layout";
import { Store } from "../utils/Store";

export default function ShippingScreen() {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { shippingAddress } = cart;
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const submitHandler = ({ fullName, address, city, postalCode, country }) => {
    const payload = { fullName, address, city, postalCode, country };

    dispatch({
      type: 'SAVE_ADDRESS',
      payload
    })

    Cookies.set('my-amazon:cart',
      JSON.stringify({
        ...cart,
        shippingAddress: payload
      })
    )

    router.push('/payment');
  }

  useEffect(() => {
    setValue('fullName', shippingAddress.fullName);
    setValue('address', shippingAddress.address);
    setValue('city', shippingAddress.city);
    setValue('postalCode', shippingAddress.postalCode);
    setValue('country', shippingAddress.country);
  }, [setValue, shippingAddress]);

  return (
    <Layout title={ checkout_steps[1] }>
      <CheckoutWizard activeStep={1} />
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-xl">{ checkout_steps[1] }</h1>
        <div className="mb-4">
          <label htmlFor="fullName">Nome completo</label>
          <input id="fullName" className="w-full"
            autoFocus
            {...register('fullName', {
              required: "Digite o seu nome completo"
            })}
          />
          {errors.fullName && (
            <div className="text-red-500">{ errors.fullName }</div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="address">Endereço</label>
          <input id="address" className="w-full"
            {...register('address', {
              required: "Digite o seu nome completo",
              minLength: { value: 3, message: "Endereço deve ter mais que 2 letras"}
            })}
          />
          {errors.address && (
            <div className="text-red-500">{ errors.address }</div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="city">Cidade</label>
          <input id="city" className="w-full"
            {...register('city', {
              required: "Digite a cidade",
            })}
          />
          {errors.city && (
            <div className="text-red-500">{ errors.city }</div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="postalCode">CEP</label>
          <input id="postalCode" className="w-full"
            {...register('postalCode', {
              required: "Digite o CEP",
            })}
          />
          {errors.postalCode && (
            <div className="text-red-500">{ errors.postalCode }</div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="country">País</label>
          <input id="country" className="w-full"
            {...register('country', {
              required: "Digite o País",
            })}
          />
          {errors.country && (
            <div className="text-red-500">{ errors.country }</div>
          )}
        </div>

        <div className="mb-4 flex justify-between">
          <button className="primary-button">Continuar</button>
        </div>
      </form>
    </Layout>
  )
}

ShippingScreen.auth = true;