import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Button,
  IconButton,
  Chip,
  Divider,
  CircularProgress,
  Paper,
} from '@mui/material'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { productsAPI } from '../services/api'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await productsAPI.getById(id)
        setProduct(response.data)
      } catch (error) {
        console.error('Failed to fetch product:', error)
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handlePrev = () => {
    if (!product) return
    setCurrentImage((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    )
  }

  const handleNext = () => {
    if (!product) return
    setCurrentImage((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    )
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '70vh',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (!product) {
    return (
      <Box sx={{ padding: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="error" gutterBottom>Product not found</Typography>
        <Button variant="contained" onClick={() => navigate(-1)} sx={{ mt: 2 }}>Go Back</Button>
      </Box>
    )
  }

  return (
    <Box sx={{ padding: { xs: 2, md: 4 }, display: 'flex', justifyContent: 'center' }}>
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: '1100px',
          borderRadius: 4,
          padding: { xs: 3, md: 5 },
          boxShadow: '0px 10px 40px rgba(0,0,0,0.06)',
          border: (theme) => `1px solid ${theme.palette.divider}`,
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? 'linear-gradient(145deg, #1e1e1e, #121212)'
              : 'linear-gradient(145deg, #ffffff, #fbfbfb)',
        }}
      >
        {/* Top Header: Go Back Navigation */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{
            textTransform: 'none',
            fontWeight: 'bold',
            color: 'text.secondary',
            mb: 4,
            "&:hover": {
              color: 'text.primary',
              backgroundColor: 'action.hover',
            },
          }}
        >
          Back to Listings
        </Button>

        {/* Responsive Grid Split Layout */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.2fr 1fr' },
            gap: { xs: 4, md: 6 },
            alignItems: 'start',
          }}
        >
          {/* Left Column: Image Carousel Area */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box
              sx={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: { xs: '300px', sm: '400px' },
                backgroundColor: (theme) =>
                  theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)',
                borderRadius: 3,
                overflow: 'hidden',
                border: (theme) => `1px solid ${theme.palette.divider}`,
              }}
            >
              {product.images.length > 1 && (
                <IconButton
                  onClick={handlePrev}
                  sx={{
                    position: 'absolute',
                    left: 16,
                    zIndex: 2,
                    backgroundColor: (theme) =>
                      theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.7)',
                    backdropFilter: 'blur(4px)',
                    "&:hover": {
                      backgroundColor: (theme) =>
                        theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.9)',
                    },
                  }}
                >
                  <ArrowBackIosNewIcon fontSize="small" />
                </IconButton>
              )}

              <img
                src={product.images[currentImage]}
                alt={`${product.title}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  padding: '16px',
                  boxSizing: 'border-box',
                }}
              />

              {product.images.length > 1 && (
                <IconButton
                  onClick={handleNext}
                  sx={{
                    position: 'absolute',
                    right: 16,
                    zIndex: 2,
                    backgroundColor: (theme) =>
                      theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.7)',
                    backdropFilter: 'blur(4px)',
                    "&:hover": {
                      backgroundColor: (theme) =>
                        theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.9)',
                    },
                  }}
                >
                  <ArrowForwardIosIcon fontSize="small" />
                </IconButton>
              )}
            </Box>

            {/* Slide Indicator Dots */}
            {product.images.length > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 1 }}>
                {product.images.map((_, idx) => (
                  <Box
                    key={idx}
                    onClick={() => setCurrentImage(idx)}
                    sx={{
                      width: currentImage === idx ? 24 : 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: currentImage === idx ? 'primary.main' : 'action.disabled',
                      cursor: 'pointer',
                      transition: 'width 0.3s ease, background-color 0.3s ease',
                    }}
                  />
                ))}
              </Box>
            )}
          </Box>

          {/* Right Column: Product Detail & Action Section */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box>
              <Chip
                label={product.category?.name || product.category || 'Category'}
                color="primary"
                variant="outlined"
                size="small"
                sx={{ fontWeight: 'bold', textTransform: 'uppercase', mb: 1.5 }}
              />
              <Typography variant="h4" fontWeight="800" gutterBottom sx={{ letterSpacing: '-0.5px' }}>
                {product.title}
              </Typography>

              {/* Price Tag Container */}
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  bgcolor: (theme) =>
                    theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.08)' : 'rgba(25, 118, 210, 0.05)',
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  mt: 1,
                }}
              >
                <Typography variant="h4" color="primary.main" fontWeight="900">
                  ₹{product.price}
                </Typography>
              </Box>
            </Box>

            <Divider />

            {/* Seller Info Container */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 2,
                borderRadius: 3,
                bgcolor: 'action.hover',
                border: (theme) => `1px solid ${theme.palette.divider}`,
              }}
            >
              <AccountCircleIcon color="action" sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Listed By
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold">
                  {product.sellerId?.name || 'Unknown Seller'}
                </Typography>
              </Box>
            </Box>

            {/* Description Block */}
            <Box>
              <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" gutterBottom>
                Description
              </Typography>
              <Typography
                variant="body1"
                color="text.primary"
                sx={{
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                  pl: 2,
                  borderLeft: '3px solid',
                  borderColor: 'primary.main',
                }}
              >
                {product.description || 'No description provided.'}
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />

            {/* Action Area */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              {product.status === 'active' && (
                <Button
                  variant="contained"
                  onClick={() => navigate(`/chat/${product._id || product.id}`)}
                  sx={{
                    flexGrow: 1,
                    borderRadius: 3,
                    paddingY: 1.5,
                    fontWeight: 'bold',
                    textTransform: 'none',
                    fontSize: '1rem',
                    boxShadow: (theme) =>
                      theme.palette.mode === 'dark'
                        ? '0px 4px 20px rgba(144, 202, 249, 0.3)'
                        : '0px 4px 20px rgba(25, 118, 210, 0.2)',
                    background: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'linear-gradient(45deg, #90caf9, #64b5f6)'
                        : 'linear-gradient(45deg, #1976d2, #1e88e5)',
                    "&:hover": {
                      transform: 'translateY(-1px)',
                      boxShadow: (theme) =>
                        theme.palette.mode === 'dark'
                          ? '0px 6px 24px rgba(144, 202, 249, 0.4)'
                          : '0px 6px 24px rgba(25, 118, 210, 0.3)',
                    },
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                >
                  Contact Seller
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}

export default ProductDetail