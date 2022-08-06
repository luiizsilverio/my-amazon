import { useReducer, useEffect } from "react";
import { useRouter } from "next/router";
import { PrinterIcon } from '@heroicons/react/outline'
import Link from "next/link";
import Image from "next/image";
import axios from "axios";

import Layout from "../../components/Layout";
import { getError } from "../../utils/error";
import StripeContainer from "../../components/StripeContainer";

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'PAY_REQUEST':
      return { ...state, loadingPay: true };
    case 'PAY_SUCCESS':
      return { ...state, loadingPay: false, successPay: true, order: action.payload };
    case 'PAY_FAIL':
      return { ...state, loadingPay: false, successPay: false };
    default:
      return state;
  }
}

// order/:id
function OrderScreen() {
  const { query } = useRouter();
  const orderId = query.id;

  const [{
    order,
    loading,
    error,
    loadingPay,
  }, dispatch] = useReducer(reducer, {
    loading: true,
    order: {},
    error: ''
  })

  const {
    shippingAddress, paymentMethod, orderItems,
    itemsPrice, taxPrice, shippingPrice, totalPrice,
    isPaid, paidAt, isDelivered, deliveredAt, paymentResult,
  } = order;


  function onPay(success, order) {
    if (success) {
      console.log(order)
      dispatch({ type: 'PAY_SUCCESS', payload: order });
    } else {
      dispatch({ type: 'PAY_FAIL', payload: getError(error) });
    }
  }

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/${orderId}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      }
      catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    }

    if (!order._id || (order._id && order._id !== orderId)) {
      fetchOrder();
    }
  }, [order, orderId])


  function showPedido() {
    return (
      <div className="grid md:grid-cols-4 md:gap-5">
        <div className="overflow-x-auto md:col-span-3">
          <div className="card p-5">
            <h2 className="mb-2 text-lg font-semibold">
              Endereço de Entrega
            </h2>
            <div>
              {shippingAddress.fullName}, {shippingAddress.address}, {' '}
              {shippingAddress.city}, {shippingAddress.postalCode}, {' '}
              {shippingAddress.country}
            </div>
            {
              isDelivered ? (
                <div className="alert-success">Entregue em {deliveredAt}</div>
              ) : (
                <div className="alert-error">Não Entregue</div>
              )
            }
          </div>

          <div className="card p-5">
            <h2 className="mb-2 text-lg font-semibold">
              Método de Pagamento
            </h2>
            <div className="flex items-center">
            <div>{ paymentMethod }</div>
            {
              isPaid ? (
                <>
                  <div className="w-full alert-success">Pago em {paidAt}</div>
                  <a target="_blank"
                    rel="noreferrer"
                    href={paymentResult.url}
                    className="flex alert-success"
                  >
                    <PrinterIcon className="h-6 w-6"></PrinterIcon>
                    Visualizar
                  </a>
                </>
              ) : (
                <div className="w-full alert-error">Não foi pago</div>
              )
            }
            </div>
          </div>

          <div className="card overflow-x-auto p-5">
            <h2 className="mb-2 text-lg font-semibold">
              Itens do Pedido
            </h2>
            <table className="min-w-full">
              <thead className="border-b">
                <tr>
                  <th className="px-5 text-left">Item</th>
                  <th className="p-5 text-right">Quantidade</th>
                  <th className="p-5 text-right">Preço</th>
                  <th className="p-5 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {
                  orderItems.map((item) => (
                    <tr key={item._id} className="border-b">
                      <td>
                        <Link href={`/product/${item.slug}`}>
                          <a className="flex items-center">
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={50}
                              height={50}
                            />
                            &nbsp;
                            {item.name}
                          </a>
                        </Link>
                      </td>
                      <td className="pl-5 text-right">{item.quantity}</td>
                      <td className="pl-5 text-right">R$ {item.price}</td>
                      <td className="pl-5 text-right">
                        R$ {item.quantity * item.price}
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <div className="card p-5">
            <h2 className="mb-2 text-lg font-semibold">Total do Pedido</h2>
            <ul>
              <li>
                <div className="mb-2 flex justify-between">
                  <div>Itens</div>
                  <div>R$ {itemsPrice}</div>
                </div>
              </li>
              <li>
                <div className="mb-2 flex justify-between">
                  <div>Imposto</div>
                  <div>R$ {taxPrice}</div>
                </div>
              </li>
              <li>
                <div className="mb-2 flex justify-between">
                  <div>Taxa de entrega</div>
                  <div>R$ {shippingPrice}</div>
                </div>
              </li>
              <li>
                <div className="mb-2 flex justify-between">
                  <div>Valor Total</div>
                  <div>R$ {totalPrice}</div>
                </div>
              </li>
            </ul>
          </div>

          {!isPaid && paymentMethod === "Stripe" && (
            <>
              <StripeContainer
                orderId={order._id}
                name={shippingAddress.fullName}
                amount={order.totalPrice}
                onPay={onPay}
                startPay={() => dispatch({ type: 'PAY_REQUEST' })}
              />
              {loadingPay && <div>Aguarde...</div>}
            </>
          )}

        </div>
      </div>
    )
  }

  return (
    <Layout title={`Pedido ${orderId}`}>
      <h1 className="mb-4 text-xl font-semibold">{`Pedido ${orderId}`}</h1>
      {
        loading ? (<div>Aguarde...</div>) :
          error ? (
            <div className="alert-error">{ error }</div>
          ) : (
            <>
              { showPedido() }
            </>
          )
      }
    </Layout>
  )
}

OrderScreen.auth = true;
export default OrderScreen;