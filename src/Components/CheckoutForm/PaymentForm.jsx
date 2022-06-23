import React from 'react';
import { Typography, Button, Divider } from '@mui/material';
import { Elements, CardElement, ElementsConsumer } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import ReviewForm from './ReviewForm';

const stripePromise = loadStripe('...');

const PaymentForm = ({ checkoutToken, backStep }) => {
  return ( 
    <>
      <ReviewForm checkoutToken={checkoutToken}></ReviewForm>
      <Divider />
      <Typography variant="h6" gutterBottom style={{margin: '20px 0'}} > Payment Method</Typography>
      <Elements stripe={stripePromise}>
        <ElementsConsumer>
          {({ elements, stripe }) => (  // parentesis pq la callback tiene otro return
            <form>
              <CardElement />
              <br /><br />
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <Button variant='outlined' onClick={backStep}>Back</Button>
                <Button type='submit' variant='contained' disabled={!stripe} color='primary'>
                  Pay {checkoutToken.live.subtotal.formatted_with_symbol }
                </Button>
              </div>
            </form>
          )}
        </ElementsConsumer>
      </Elements>
    </>
  )
}

export default PaymentForm