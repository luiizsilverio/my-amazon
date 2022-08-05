import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

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

export default function PaymentForm({ orderId, name, amount }) {
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

        const response = await axios.put(`/api/orders/${orderiD}/pay`, {
          orderId,
          cardId,
          name,
          amount: +amount * 100,
        })

        if (response.data.success) {
          console.log("Pagamento efetuado com sucesso");
          setSuccess(true);
        }

      } catch (error) {
        console.warn("Erro:", error);
        setSuccess(false);
      }
    } else {
      console.warn("Erro:", error.message);
      setSuccess(false);
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