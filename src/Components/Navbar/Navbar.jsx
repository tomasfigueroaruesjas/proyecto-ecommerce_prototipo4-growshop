import React from 'react';
import { AppBar, Toolbar, IconButton, Badge, MenuItem, Menu, Typography } from '@material-ui/core';
import { ShoppingCart } from '@material-ui/icons';
import { Link, useLocation } from 'react-router-dom';

import useStyles from './styles';

import logo from '../../assets/logo.png';
const Navbar = ({cartTotal}) => {
    const classes = useStyles();
    const location = useLocation();
  return (
      <>
        <AppBar position="fixed" className={classes.appBar} color="inherit">
            <Toolbar>
                    <Typography component={Link} to='/' variant="h6" className={classes.title}>
                        <img src={logo} alt="Yerba Buena Growshop" height="25px" className={classes.image} />
                        Yerba Buena Growshop
                    </Typography>
                <div className={classes.grow} />
                {location.pathname === '/' && (  // Funciona como if ternario pero no hace falta else. Si la condic no cumple, no se ejecuta el &&
                <div className={classes.button}>
                    <IconButton component={Link} to='/cart' aria-label="Show cart items" color="inherit">
                        <Badge badgeContent={cartTotal} color="secondary">
                            <ShoppingCart />
                        </Badge>
                    </IconButton>
                </div>
                )}
            </Toolbar>
        </AppBar>
      </>
  );
};

export default Navbar;
