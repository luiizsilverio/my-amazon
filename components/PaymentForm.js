import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import { toast } from "react-toastify";

const CARD_OPTIONS = {
	iconStyle: "solid",
	style: {
		base: {
			iconColor: "#c4f0ff",
			fontWeight: 500,
			fontSize: "13px",
			fontSmoothing: "antialiased",
			":-webkit-autofill": { color: "#fce883" },
			"::placeholder": { color: "#87bbfd" }
		},
		invalid: {
			iconColor: "#ffc7ee",
			color: "#ffc7ee"
		}
	}
}

export default function PaymentForm({ orderId, name, amount, onPay }) {
  const stripe = useStripe();
  const elements = useElements();

  async function handlePay(e) {
    e.preventDefault();

    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    })

    if (!error) {
      try {
        const { id: cardId } = paymentMethod

        const response = await axios.put(`/api/orders/${orderId}/pay`, {
          orderId,
          cardId,
          name,
          amount
        })

        if (response.data.success) {
          toast.success("Pagamento efetuado com sucesso");
          onPay(true, response.data.order);
        }

      } catch (error) {
        toast.error("Erro ao efetuar pagamento.");
        console.warn("Erro:", error);
        onPay(false, null);
      }
    } else {
        toast.error("Erro ao efetuar pagamento.");
        console.warn("Erro:", error.message);
        onPay(false, null);
    }
  }

  return (
    <div className="card p-5">
      <h2 className="mb-2 text-lg font-semibold">Informe o Nº do Cartão</h2>
      <form onSubmit={handlePay}>
        <div className="my-4">
          <CardElement options={CARD_OPTIONS} />
        </div>
        <button className="primary-button">
          Pagar
        </button>
      </form>
    </div>
  )
}