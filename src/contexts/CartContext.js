import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product, quantity, color, size) => {
    setCartItems(prevItems => {
      // Verifica se o item já existe no carrinho com a mesma cor e tamanho
      const existingItemIndex = prevItems.findIndex(
        item => item.id === product.id && item.color === color && item.size === size
      );

      if (existingItemIndex > -1) {
        // Se existir, atualiza a quantidade
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += quantity;
        return newItems;
      } else {
        // Se não existir, adiciona como novo item
        return [...prevItems, { ...product, quantity, color, size }];
      }
    });
  };

  const removeFromCart = (itemId, color, size) => {
    setCartItems(prevItems => prevItems.filter(
      item => !(item.id === itemId && item.color === color && item.size === size)
    ));
  };

  const updateItemQuantity = (itemId, color, size, newQuantity) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId && item.color === color && item.size === size
          ? { ...item, quantity: Math.max(1, newQuantity) }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateItemQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}; 