import React from 'react';
import { Typography, Button, Divider } from '@mui/material';
import { Elements, CardElement, ElementsConsumer } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import ReviewForm from './ReviewForm';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const PaymentForm = ({ checkoutToken, backStep, nextStep, shippingData, handleCaptureCheckout }) => {
  const handleSubmit = async (event, elements, stripe) => {
    event.preventDefault();

    if (!elements || !stripe) return;

    const cardElement = elements.getElement(CardElement); 

    const { error, paymentMethod } =  await stripe.createPaymentMethod({type: 'card', card: cardElement});

    if(error) {
      console.log(error)
    } else {
      const orderData = {
        line_items: checkoutToken.live.line_items,
        customer: { firstname: shippingData.firstName,
          lastname: shippingData.lastName,
          email: shippingData.email
         },
         shipping: {
          name: 'Primary', 
          street: shippingData.address, 
          town_city: shippingData.city,
          county_state: shippingData.shippingSubdivision,
          postal_zip_code: shippingData.zip,
          country: shippingData.shippingCountry
         },
         fulfillment: { shipping_method: shippingData.shippingOption },
         payment : {
          gateway: 'stripe',
          stripe: {
            payment_method_id: paymentMethod.id
          }
         }
      }
      handleCaptureCheckout(checkoutToken.id, orderData);

      nextStep();
    }

  }

  return ( 
    <>
      <ReviewForm checkoutToken={checkoutToken}></ReviewForm>
      <Divider />
      <Typography variant="h6" gutterBottom style={{margin: '20px 0'}} > Payment Method</Typography>
      <React.StrictMode>
      <Elements stripe={stripePromise}>
        <ElementsConsumer>
          {({ elements, stripe }) => (  // parentesis pq la callback tiene otro return
            <form onSubmit={(e) => handleSubmit(e, elements, stripe)}>
              <CardElement />
              <br /><br />
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <Button variant='outlined' onClick={backStep}>Back</Button>
                <Button type='submit' variant='contained' disabled={!stripe} color='primary'>
                  {/* disabled={!stripe} - Si no se consigue el stripe, el boton va a estar inhabilitado */}
                  Pay {checkoutToken.live.subtotal.formatted_with_symbol }
                </Button>
              </div>
            </form>
          )}
        </ElementsConsumer>
      </Elements>
      </React.StrictMode>
    </>
  )
}

export default PaymentForm