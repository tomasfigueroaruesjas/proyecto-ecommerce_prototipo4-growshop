import React from 'react';
import { Card, CardMedia, CardContent, CardActions, Typography, IconButton } from '@material-ui/core';
import { AddShoppingCart } from '@material-ui/icons';
import useStyles from './styles';

const Product = ({ product, onAddToCart }) => {  // desestructurado así no hay que usar props.product.x
    const classes = useStyles();
  return (<div>
       <Card className={classes.root}>
            <CardMedia className={classes.media} image={product.image.url} title={product.name} />
            <CardContent>
                <div className={classes.cardContent}>
                    <Typography variant="h5" gutterBottom>
                        {product.name}
                    </Typography>
                    <Typography variant="h5">
                        {product.price.formatted_with_symbol}
                    </Typography>
                </div>
                {/* dangerouslySetInnerHTML: permite renderizar el html que viene del sv. OJO: INVESTIGAR. PUEDE SER PELIGROSO */}
                {}
                <Typography dangerouslySetInnerHTML={{ __html: product.description.length > 30 ? product.description = product.description.slice(0, 30) + "..." : product.description }} variant="body2" color="textSecondary" /> 
            </CardContent>
            <CardActions disableSpacing className={classes.cardActions}>
                <IconButton aria-label="Add to Cart" onClick={() => onAddToCart(product.id, 1)}>
                    <AddShoppingCart />
                </IconButton>
            </CardActions>
       </Card>
  </div>)
};

export default Product;
