import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton,
  Chip
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import styled from '@emotion/styled';

const StyledCard = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.3s ease;
  box-shadow: none;
  border-radius: 4px;
  border: none;
  
  &:hover {
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const StyledCardMedia = styled(CardMedia)`
  height: 200px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-color: #f5f5f5;
  border-radius: 0;
  padding: 0;
`;

const PriceTypography = styled(Typography)`
  font-weight: 700;
  color: #000;
  font-size: 1rem;
`;

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <StyledCard>
      <CardActionArea onClick={handleClick} sx={{ height: '100%', position: 'relative' }}>
        <Box sx={{ position: 'relative' }}>
        <StyledCardMedia
            image={product.imagem}
          title={product.nome}
        />
          <Chip
            label="Mais Vendidos"
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              fontWeight: 'bold',
              bgcolor: '#000',
              color: 'white',
              borderRadius: '4px',
              fontSize: '0.7rem',
              height: 'auto',
              padding: '2px 6px'
            }}
          />
          <Box sx={{ position: 'absolute', top: 0, right: 0, p: 1 }}>
            <IconButton size="small" sx={{ color: '#000' }}>
              <FavoriteBorderIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 0.5, padding: '0.8rem' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Typography variant="body2" component="h3" noWrap sx={{ fontWeight: 'normal', fontSize: '0.9rem' }}>
              {product.nome}
            </Typography>
          </Box>

          <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
            <PriceTypography variant="body1">
              R$ {product.preco ? Number(product.preco).toFixed(2) : 'N/A'}
            </PriceTypography>
            {product.precoOriginal && product.precoOriginal > product.preco && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textDecoration: 'line-through', fontSize: '0.8rem' }}
              >
                R$ {Number(product.precoOriginal).toFixed(2)}
              </Typography>
            )}
          </Box>
        </CardContent>
      </CardActionArea>
    </StyledCard>
  );
};

export default ProductCard; 