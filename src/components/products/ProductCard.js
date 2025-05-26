import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActionArea,
  Box,
  Rating,
  Chip,
} from '@mui/material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease-in-out;
  
  &:hover {
    transform: translateY(-4px);
  }
`;

const StyledCardMedia = styled(CardMedia)`
  height: 200px;
  background-size: contain;
  background-position: center;
  background-color: ${props => props.theme.palette.background.paper};
`;

const PriceTypography = styled(Typography)`
  font-weight: 700;
  color: ${props => props.theme.palette.primary.main};
`;

const MotionCard = motion(StyledCard);

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -8 }}
    >
      <CardActionArea onClick={handleClick} sx={{ height: '100%' }}>
        <StyledCardMedia
          image={product.imageUrl}
          title={product.nome}
        />
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Typography variant="h6" component="h2" noWrap>
              {product.nome}
            </Typography>
            {product.desconto && (
              <Chip
                label={`-${product.desconto}%`}
                color="secondary"
                size="small"
                sx={{ ml: 1 }}
              />
            )}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Rating value={product.rating || 0} precision={0.5} size="small" readOnly />
            <Typography variant="body2" color="text.secondary">
              ({product.reviews || 0})
            </Typography>
          </Box>

          <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'baseline', gap: 1 }}>
            <PriceTypography variant="h6">
              R$ {product.preco.toFixed(2)}
            </PriceTypography>
            {product.precoOriginal && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textDecoration: 'line-through' }}
              >
                R$ {product.precoOriginal.toFixed(2)}
              </Typography>
            )}
          </Box>

          {product.parcelas && (
            <Typography variant="body2" color="text.secondary">
              em até {product.parcelas}x de R$ {(product.preco / product.parcelas).toFixed(2)}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </MotionCard>
  );
};

export default ProductCard; 