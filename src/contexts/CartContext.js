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
    console.log('addToCart chamado com:', { product, quantity, color, size });
    setCartItems(prevItems => {
      // Verifica se o item já existe no carrinho com a mesma cor e tamanho
      const existingItemIndex = prevItems.findIndex(
        item => item.id === product.id && item.color === color && item.size === size
      );

      if (existingItemIndex > -1) {
        // Se existir, atualiza a quantidade
        const newItems = [...prevItems];

        console.log('Item existente encontrado. Quantidade atual:', newItems[existingItemIndex].quantity, 'Quantidade a adicionar:', quantity);
        newItems[existingItemIndex].quantity = Number(newItems[existingItemIndex].quantity) + Number(quantity);
        console.log('Nova quantidade do item existente:', newItems[existingItemIndex].quantity);
        return newItems;
      } else {

        console.log('Novo item: Preço original:', product.preco, 'Quantidade original:', quantity);
        const cleanPrice = String(product.preco).replace('R$', '').replace(',', '.').trim();
        const numericPrice = parseFloat(cleanPrice);
        console.log('Preço limpo (', cleanPrice, ') -> Numérico (', numericPrice, ')');
        console.log('Quantidade original (', quantity, ') -> Numérica (', Number(quantity), ')');

   
        const newItem = {
          id: product._id || product.id, // Usar _id ou id
          nome: product.nome,
          imagem: product.imagem || product.imageUrl || '', 
          preco: numericPrice,
          quantidade: Number(quantity),
          color: color, 
          size: size, 

          ...product, 
        };

        console.log('Novo item construído:', newItem);

        return [...prevItems, newItem];
      }
    });
  };

  const removeFromCart = (itemId, color, size) => {
    setCartItems(prevItems => prevItems.filter(
      item => !(item.id === itemId && item.color === color && item.size === size)
    ));
  };

  const updateItemQuantity = (itemId, color, size, newQuantity) => {
    console.log('updateItemQuantity chamado com:', { itemId, color, size, newQuantity });
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId &&
        (item.color === color || (!item.color && !color)) &&
        (item.size === size || (!item.size && !size))
          ? (
              console.log('Atualizando quantidade para item:', item.nome, 'Nova quantidade:', newQuantity, '-> Numérica:', Number(newQuantity)),
              { ...item, quantity: Math.max(1, Number(newQuantity)) } // Garante que newQuantity seja número
            )
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