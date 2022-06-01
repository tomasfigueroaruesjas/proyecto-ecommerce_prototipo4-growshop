import React from 'react';
import Review from './ReviewForm';

const PaymentForm = ({ checkoutToken }) => {
  return ( 
    <Review checkoutToken={checkoutToken}></Review>
  )
}

export default PaymentForm