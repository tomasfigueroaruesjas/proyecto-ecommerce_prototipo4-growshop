import {React, useState, useEffect} from "react";
import useStyles from "./styles";
import {
  Paper,
  Stepper,
  Button,
  Typography,
  Step,
  StepLabel,
  CircularProgress,
  Divider,
} from "@material-ui/core";
import  AddressForm from "../AddressForm";
import  PaymentForm  from "../PaymentForm";

import { commerce } from '../../../lib/commerce';
import ErrorBoundary from "../../ErrorBoundary/ErrorBoundary";

const steps = ['Shipping Address', 'Payment details'];

const Checkout = ({ cart, handleCaptureCheckout, error, order }) => {
  const classes = useStyles();
  const [checkoutToken, setCheckoutToken] = useState(null);
  const [shippingData, setShippingData] = useState({});
  const [activeStep, setActiveStep] = useState(0);

  const Confirmation = () => (
    <div>Confirmation</div>
  );

  const Form = () => activeStep === 0 ? <AddressForm checkoutToken={checkoutToken} next={next}/> : 
  <PaymentForm shippingData={shippingData} checkoutToken={checkoutToken} backStep={prevStep} nextStep={nextStep} handleCaptureCheckout={handleCaptureCheckout} />;

  const nextStep = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }

  const prevStep = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }

  const next = (data) => {
    setShippingData(data);

    nextStep();
  }

  useEffect(() => {
    const generateToken = async () => { // Se crea una función porque adentro de useEffect no se puede usar async así nomás
      try {
        const token = await commerce.checkout.generateToken(cart.id, { type: 'cart' });
        console.log(token);
        setCheckoutToken(token);
      } catch (error) {
        console.log('F', error);
      }
    }

    generateToken();
  }, [cart]);
  console.log(cart);
  
  if(!cart) {
    throw new Error("No hay carrito");
  }
  return (
    
    <>
   
      <div className={classes.toolbar} />
      <main className={classes.layout} >
        <Paper className={classes.paper}>
          <Typography align="center" variant="h4">Checkout</Typography>
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map((step) => (
              <Step key={step}>
                <StepLabel>{step}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length ? <Confirmation /> : checkoutToken ? <Form /> : '...Cargando'}
          
        </Paper>
      </main>
    </>
  );
};

export default Checkout;
