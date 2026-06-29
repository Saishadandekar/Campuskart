import React, { useState, useEffect } from 'react';
import { Card, CardMedia, CardContent, Typography, Chip, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const statusColors = {
  pending: 'warning',
  active: 'success',
  rejected: 'error',
  // Using 'secondary' for sold items, but switching to 'success' for the chip color
  sold: 'secondary',
  purchased: 'info',
};

const ProductCard = ({ product, showStatus = false, onResubmit, onMarkAsSold, isOwner = false, isSoldItem = false, children }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const navigate = useNavigate();

  const images = product?.images;

  // Image carousel effect
  useEffect(() => {
    if (!images || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImage((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, 6000);
    return () => clearInterval(interval);
  }, [images]);

  // Safety check and determination of sold status
  if (!product) {
    return null; // Don't render if product is missing
  }

  // Use the passed isSoldItem prop instead of trying to read from product
  const displayStatus = isSoldItem ? 'sold' : product.status;

  // Handles clicks on the card
  const handleCardClick = (e) => {
    // Check if the click originated from the resubmit button
    if (e.target.closest('.resubmit-button')) {
      e.preventDefault(); // Prevent any other click behavior
      if (onResubmit) onResubmit(product);
    } else {
      // If not the button, navigate to the product detail page
      navigate(`/product/${product._id || product.id}`);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      style={{ textDecoration: 'none', cursor: 'pointer' }}
    >
      <Card
        sx={{
          width: '100%',
          height: 'auto',
          minHeight: 280,
          borderRadius: 3,
          boxShadow: 2,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: 6,
          },
          // Add a different border for sold items
          ...(isSoldItem && {
            border: '2px solid #4caf50',
          }),
        }}
      >
        <CardMedia
          component="img"
          image={
            Array.isArray(product.images)
              ? product.images[currentImage]
              : product.images
          }
          alt={product.title}
          sx={{
            height: 180,
            objectFit: 'contain',
            transition: 'opacity 0.5s ease',
            mt: 4,
            mb: 4, // CORRECTED: Changed 'bt:4' to 'mb:4'
          }}
        />

        {/* Display Status Chip */}
        {showStatus && displayStatus && (
          <Chip
            label={
              displayStatus === 'active'
                ? 'Active'
                : displayStatus === 'sold'
                  ? isSoldItem ? 'Sold by you' : 'Sold'
                  : displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)
            }
            color={
              displayStatus === 'sold' ? 'success' :
                statusColors[displayStatus] || 'default'
            }
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              fontWeight: 'bold',
            }}
          />
        )}

        <CardContent sx={{ textAlign: 'center', paddingY: 1, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography variant="subtitle1" fontWeight="bold" noWrap>
            {product.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ₹{product.price}
          </Typography>

          {/* Show sold indicator for sold items in history tab */}
          {isSoldItem && (
            <Typography variant="caption" color="success.main" sx={{ fontWeight: 'bold', mt: 0.5 }}>
              ✓ Sold by you
            </Typography>
          )}

          {product.status === 'rejected' && product.rejectionReason && (
            <Typography variant="caption" color="error">
              Reason: {product.rejectionReason}
            </Typography>
          )}

          {/* Mark as Sold button for active products owned by current user */}
          {isOwner && product.status === 'active' && onMarkAsSold && (
            <Button
              variant="contained"
              size="small"
              color="success"
              sx={{ mt: 1 }}
              onClick={(e) => {
                e.stopPropagation();
                onMarkAsSold(product);
              }}
            >
              Mark as Sold
            </Button>
          )}

          {/* Resubmit button for rejected products */}
          {product.status === 'rejected' && onResubmit && (
            <Button
              className="resubmit-button"
              variant="contained"
              size="small"
              sx={{ mt: 1 }}
              onClick={(e) => {
                e.stopPropagation();
                onResubmit(product);
              }}
            >
              Resubmit
            </Button>
          )}
          {children}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductCard;