import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

import Layout from "../components/Layout";
import CheckoutWizard, { checkout_steps } from "../components/CheckoutWizard";
import { Store } from "../utils/Store";

export default function PaymentScreen() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const router = useRouter()

  const submitHandler = (e) => {
    e.preventDefault();
    console.log(selectedPaymentMethod)

    if (!selectedPaymentMethod) {
      return toast.error('Método de pagamento não informado');
    }

    dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: selectedPaymentMethod });
    Cookies.set(
      'myamazon.cart',
      JSON.stringify({
        ...cart,
        paymentMethod: selectedPaymentMethod,
      })
    )

    router.push('/placeorder');
  }

  useEffect(() => {
    if (!cart.shippingAddress) {
      return router.push('/shipping');
    }
    setSelectedPaymentMethod(cart.paymentMethod || '');
  }, [cart.paymentMethod, cart.shippingAddress, router])

  return (
    <Layout title={ checkout_steps[2] }>
      <CheckoutWizard activeStep={2} />
      <form className="mx-auto max-w-screen-md" onSubmit={submitHandler}>
        <h1 className="mb-4 text-xl font-semibold">{ checkout_steps[2] }</h1>
        {
          ['PayPal', 'Stripe', 'CashOnDelivery'].map((payment) => (
            <div key={ payment } className="mb-4">
              <input type="radio"
                name="paymentMethod"
                id={ payment }
                checked={selectedPaymentMethod === payment}
                className="p-2 outline-none focus:ring-0"
                onChange={() => setSelectedPaymentMethod(payment)}
              />

              <label htmlFor={payment}>{ payment }</label>
            </div>
          ))
        }
        <div className="mb-4 flex justify-between">
          <button type="button"
            className="default-button"
            onClick={() => router.push('/shipping')}
          >
            Voltar
          </button>
          <button className="primary-button">Continuar</button>
        </div>
      </form>
    </Layout>
  )
}

PaymentScreen.auth = true;
