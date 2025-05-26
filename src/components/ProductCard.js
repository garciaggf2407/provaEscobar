import React from 'react';
import './ProductCard.css';

function ProductCard({ product, onClick }) {
  return (
    <div className="product-card" onClick={() => onClick(product)}>
      <img src={product.imageUrl || 'placeholder.png'} alt={product.nome} className="product-image" />
      <div className="product-info">
        <h3 className="product-name">{product.nome}</h3>
        <p className="product-price">R$ {product.preco.toFixed(2)}</p>
        {/* Adicionar mais detalhes ou um botão de ver detalhes aqui */}
      </div>
    </div>
  );
}

export default ProductCard; 