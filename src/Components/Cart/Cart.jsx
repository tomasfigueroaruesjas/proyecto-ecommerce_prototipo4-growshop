import React from 'react';
import { Container, Typography, Button, Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';
import useStyles from './styles';
import CartItem from './CartItem/CartItem';

const Cart = ({ cart, handleUpdateCartQty, handleRemoveFromCart, handleEmptyCart}) => {
    console.log(cart);
    const classes = useStyles();
    // const isEmpty = !cart.line_items.length; No conviene, aparece antes que el condicional anti error 
    const EmptyCart = () => ( // No es tanto un componente, sino una función que devuelve un elemento jsx. Un Subcomponente
        <Typography variant="subtitle1">No hay nada</Typography>
    );

    const FilledCart = () => (
        <>
            <Grid container spacing={3} >
                {cart.line_items.map((item) => (
                    <Grid item xs={12} sm={4} key={item.id}>
                        <CartItem item={item} handleRemoveFromCart={handleRemoveFromCart} handleUpdateCartQty={handleUpdateCartQty} />
                    </Grid>
                ))}
            </Grid>
            <div className={classes.cartDetails}>
                    <Typography variant="h4" >Subtotal: {cart.subtotal.formatted_with_symbol}</Typography>
                    <div>
                        <Button className={classes.emptyButton} onClick={() => handleEmptyCart()} size= "large" type="button" variant="contained" color="secondary">Empty Cart</Button>
                        <Button component={Link} to='/checkout' className={classes.checkoutButon} size= "large" type="button" variant="contained" color="primary">Checkout</Button>
                    </div>
            </div>
        </>
    

    );

    if (!cart.line_items) return 'Loading...';

    return (<Container>
        <div className={classes.toolbar} />
        <Typography className={classes.title} variant="h3" gutterBottom>You Shopping Cart</Typography>
        {!cart.line_items.length ? <EmptyCart /> : <FilledCart />}
    </Container>)
};

export default Cart;
