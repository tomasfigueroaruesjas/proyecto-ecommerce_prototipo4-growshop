import React,{ useState, useEffect} from 'react';
import { Navbar, Products, Cart, Checkout, ErrorBoundary } from './Components';
import { commerce } from './lib/commerce';
import { Routes, BrowserRouter as Router, Route } from 'react-router-dom';

const App = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [order, setOrder] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  // let prueba = [];  

  const fetchProducts = async () => {  // función asíncrona. then catch pero más elegante we
    const { data } = await commerce.products.list(); // {data} desestructura la data de la promesa

    setProducts(data);
  }

  // function fetchProducts(){
  //   return new Promise((resolve, reject) => {
  //     const data = commerce.products.list();
  //     console.log(data);
  //     if(!data) {
  //       reject('Koño');
  //     } else {
  //       resolve(setProducts(data));
  //     }
  //   })
  // }


  const fetchCart = async () => {
    setCart(await commerce.cart.retrieve());
    
  }

  const handleAddToCart = async (productId, quantity) => {
    const {cart} = await commerce.cart.add(productId, quantity);
    setCart(cart); // No hace falta response.cart pq ya está desestructurado de entrada el objeto

  }

  const handleUpdateCartQty = async (productId, quantity) => {
    const {cart} = await commerce.cart.update(productId, {quantity}); // quantity commo objeto pq es solo eso lo que quiero actualizar
    setCart(cart);  
  }
  
  const handleRemoveFromCart = async (productId) => {
    const {cart} = await commerce.cart.remove(productId);

    setCart(cart);
  }

  const handleEmptyCart = async () => {
    const {cart} = await commerce.cart.empty();

    setCart(cart);
  }

  const refreshCart = async () => {
    const newCart = await commerce.cart.refresh();
    console.log(newCart)
    setCart(newCart);
  }

  const handleCaptureCheckout = async( checkoutTokenId, newOrder ) => {
    try {
      const incomingOrder = await commerce.checkout.capture(checkoutTokenId, ...[newOrder])

      setOrder(incomingOrder);
      refreshCart();
      console.log(incomingOrder);
    } catch (error) {
      setErrorMessage(error);
      console.log(error)
    }
  }

  useEffect(() => {
    fetchProducts();
    fetchCart();
    
    
  }, []);

  // console.log(cart);
  return (
    <Router>
      <div>
        <Navbar cartTotal={cart.total_items} />
        
        <Routes>
          
          <Route path="/cart" element={<Cart cart={cart} handleUpdateCartQty={handleUpdateCartQty} handleRemoveFromCart={handleRemoveFromCart} handleEmptyCart={handleEmptyCart} />}/>          
          <Route path="/checkout" element={<ErrorBoundary><Checkout cart={cart} handleCaptureCheckout={handleCaptureCheckout} order={order} errorMessage={errorMessage} /></ErrorBoundary>} />
          <Route path="/" element={<Products products={products} onAddToCart={handleAddToCart} />} />
          
        </Routes>
        
      </div> 
  </Router>)
};

export default App;
