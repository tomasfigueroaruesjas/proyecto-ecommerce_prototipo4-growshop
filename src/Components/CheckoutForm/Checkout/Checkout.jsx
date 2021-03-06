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
import { Link } from 'react-router-dom';

import { commerce } from '../../../lib/commerce';
import ErrorBoundary from "../../ErrorBoundary/ErrorBoundary";

const steps = ['Shipping Address', 'Payment details'];

const Checkout = ({ cart, handleCaptureCheckout, error, order }) => {
  const classes = useStyles();
  const [checkoutToken, setCheckoutToken] = useState(null);
  const [shippingData, setShippingData] = useState({});
  const [activeStep, setActiveStep] = useState(0);

  let Confirmation = () => order.costumer ? (
    <>
      <div>
        <Typography variant="h5"> Thanks for the money {order.costumer.firstname} {order.costumer.lastname} </Typography>
        <Divider className={classes.divider} />
        <Typography variant="subtitle2"> Order {order.costumer_reference}:</Typography>
      </div>
      <br />
      <Button variant="outlined" type="button" component={Link} to='/'>Back to Home</Button>
    </>
  ) : (
    <div className={classes.spinner}>
      <CircularProgress />
    </div>
  );

  if(error) {
    <>
      <Typography variant="h5">Error {error}</Typography>
      <br />
      <Button variant="outlined" type="button" component={Link} to='/'>Back to Home</Button>
    </>
  }

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
    const generateToken = async () => { // Se crea una funci??n porque adentro de useEffect no se puede usar async as?? nom??s
      try {
        const token = await commerce.checkout.generateToken(cart.id, { type: 'cart' });
        console.log(token);
        setCheckoutToken(token);
      } catch (error) {
        console.log('F', error);
      }
    }

    generateToken();
  }, []);
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
