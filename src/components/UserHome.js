import React, { useState } from 'react';
import ProductCard from './ProductCard'; // Importar o componente ProductCard
import './UserHome.css'; // Vamos criar um CSS para UserHome

function UserHome() {
  // Dados de produtos simulados (Mock Data)
  const mockProducts = [
    {
      id: 1,
      nome: 'Smartphone Modelo X',
      preco: 1500.00,
      descricao: 'Um smartphone avançado com câmera de alta resolução e bateria de longa duração.',
      imageUrl: 'https://via.placeholder.com/300x200?text=Smartphone' // Imagem placeholder um pouco maior
    },
    {
      id: 2,
      nome: 'Notebook Gamer Z',
      preco: 4500.00,
      descricao: 'Notebook potente para jogos e tarefas exigentes, com placa de vídeo dedicada.',
      imageUrl: 'https://via.placeholder.com/300x200?text=Notebook+Gamer'
    },
    {
      id: 3,
      nome: 'Smart TV 50 Polegadas',
      preco: 2200.00,
      descricao: 'Televisão inteligente com resolução 4K e acesso a streaming.',
      imageUrl: 'https://via.placeholder.com/300x200?text=Smart+TV'
    },
    {
      id: 4,
      nome: 'Fone de Ouvido Bluetooth',
      preco: 250.00,
      descricao: 'Fone sem fio com alta fidelidade de áudio e cancelamento de ruído.',
      imageUrl: 'https://via.placeholder.com/300x200?text=Fone+Bluetooth'
    },
    {
      id: 5,
      nome: 'Teclado Mecânico',
      preco: 350.00,
      descricao: 'Teclado com switches mecânicos para maior precisão e durabilidade.',
      imageUrl: 'https://via.placeholder.com/300x200?text=Teclado+Mecanico'
    },
    // Adicione mais produtos simulados aqui se desejar
  ];

  const [selectedProduct, setSelectedProduct] = useState(null); // Estado para o produto selecionado

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  // Função para fechar os detalhes
  const handleCloseDetails = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="user-home-container">
      <h2>Bem-vindo à Loja!</h2>
      <p>Confira nossos produtos disponíveis:</p>

      <div className="product-list-grid">
        {mockProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={handleProductClick} // Passa a função de click
          />
        ))}
      </div>

      {/* Seção de Detalhes do Produto */}
      {selectedProduct && (
        <div className="product-detail-section">
          <button className="close-details-button" onClick={handleCloseDetails}>X</button>
          <h3>Detalhes do Produto</h3>
          <div className="detail-content">
            <img src={selectedProduct.imageUrl || 'placeholder.png'} alt={selectedProduct.nome} className="detail-image" />
            <div className="detail-info">
              <h4>{selectedProduct.nome}</h4>
              <p><strong>Preço:</strong> R$ {selectedProduct.preco.toFixed(2)}</p>
              <p><strong>Descrição:</strong> {selectedProduct.descricao}</p>
              {/* Adicionar mais detalhes aqui */}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default UserHome; 