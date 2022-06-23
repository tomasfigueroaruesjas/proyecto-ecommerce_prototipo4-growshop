import { React, useState, useEffect } from 'react';
import { InputLabel, Select, MenuItem, Button, Grid, Typography } from '@material-ui/core';
import {  useForm, FormProvider } from 'react-hook-form';

import { Link } from 'react-router-dom';
import { commerce } from '../../lib/commerce';
 
import FormInput from './FormInput';

const AddressForm = ({ checkoutToken, next }) => {
  const [shippingCountries, setShippingCountries] = useState([]);
  const [shippingCountry, setShippingCountry] = useState('');
  const [shippingSubdivisions, setShippingSubdivisions] = useState([]);
  const [shippingSubdivision, setShippingSubdivision] = useState('');
  const [shippingOptions, setShippingOptions] = useState([]);
  const [shippingOption, setShippingOption] = useState('');

  const countries = Object.entries(shippingCountries).map(([code, name]) => ({ // Object.entries lo convierte en un array de arrays con los value pairs
    id: code, label: name                                                     // Con map lo convierto en una array simple de objetos con
  }));                                                                        //  las keys correspondientes

  const subdivisions = Object.entries(shippingSubdivisions).map(([code, name='Buenos Aires']) => ({ 
    id: code, label: name                                                     
  }));
  
  const options = shippingOptions.map((sOp) => ({
    id: sOp.id,
    label: `${sOp.description} - ${sOp.price.formatted_with_symbol}`
  }))

  const fetchShippingCountries = async (checkoutTokenId) => {
    const { countries } = await commerce.services.localeListShippingCountries(checkoutTokenId);

    console.log(countries);

    setShippingCountries(countries);
    setShippingCountry(Object.keys(countries)[0]); // Si uso las keys del objeto, puedo iterar y loopear
  }

  const fetchSubdivisions = async (checkoutTokenId, countryCode) => {
    const { subdivisions } = await commerce.services.localeListShippingSubdivisions(checkoutTokenId, countryCode);

    setShippingSubdivisions(subdivisions);
    setShippingSubdivision(Object.keys(subdivisions)[0]);

    // console.log(subdivisions);
  }
  
  const fetchOptions = async (checkoutTokenId, country, region=null) => {
    const options = await commerce.checkout.getShippingOptions(checkoutTokenId, { country, region });

    setShippingOptions(options);
    setShippingOption(options[0].id);

    // console.log(subdivisions);
  }
    

  useEffect(() => {
    fetchShippingCountries(checkoutToken.id);
    // console.log(countries);
  }, []);

  useEffect(() => {
    if(shippingCountry) fetchSubdivisions(checkoutToken.id, shippingCountry);
    // console.log(shippingCountry);
  }, [shippingCountry]);
  
  useEffect(() => {
    if(shippingSubdivision) fetchOptions(checkoutToken.id, shippingCountry, shippingSubdivision);
    // console.log(shippingCountry);
  }, [shippingSubdivision]);

  const methods = useForm();

  return (
    <>
      <Typography variant="h6" gutterBottom>Shipping Address</Typography>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit((data) => next({ ...data, shippingCountry, shippingSubdivision, shippingOption }))}> {/* ...data solo contiene la data de los formInput */}
          {!shippingOption ? '...Cargando' : <Grid container spacing={3}>
            <FormInput name="firstName" label="First name" required  />
            <FormInput name="lastName" label="Last name" required  />
            <FormInput name="Email" label="Email" required  />
            <FormInput name="address" label="Address" required  />
            <FormInput name="city" label="City" required  />
            <FormInput name="zip" label="ZIP/Postal Code" required  />
            <Grid item xs={12} sm={6}>
              <InputLabel>Shipping Country</InputLabel>
              <Select value={shippingCountry} fullWidth onChange={(e) => setShippingCountry(e.target.value)}>
                {countries.map((country) => (
                  <MenuItem key={country.id} value={country.id}>
                    {country.label} 
                  </MenuItem>
                ))}
                
              </Select>
            </Grid>
            <Grid item xs={12} sm={6}>
            <InputLabel>Shipping Subdivisions</InputLabel>
            <Select value={shippingSubdivision} fullWidth onChange={(e) => setShippingSubdivision(e.target.value)}>
              {subdivisions.map((subdivision) => (
                 <MenuItem value={subdivision.id} key={subdivision.id}>
                  {subdivision.label}
                 </MenuItem>
               ))}
            </Select>
          </Grid>
            
            <Grid item xs={12} sm={6}>
              <InputLabel>Shipping Options</InputLabel>
              <Select value={shippingOption} fullWidth onChange={(e) => setShippingOption(e.target.value)}>
                {options.map((option) => (
                  <MenuItem value={option.id} key={option.id}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>}
          <br />
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <Button variant='outlined' component={Link} to='/cart' >Back to cart</Button>
                  <Button variant='contained' type='submit' color='primary'>Next</Button>

          </div>  
        </form>
      </FormProvider>
    </>
  )
}

export default AddressForm