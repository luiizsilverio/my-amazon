import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from './PaymentForm';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function StripeContainer({ orderId, name, amount, onPay }) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm
        orderId={orderId}
        name={name}
        amount={amount}
        onPay={onPay}
      />
    </Elements>
  )
}