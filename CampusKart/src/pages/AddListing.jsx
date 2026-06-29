import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  InputAdornment,
  Paper,
} from '@mui/material'
import categories from '../data/categories'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import { productsAPI } from '../services/api'

const AddListing = ({ onAddProduct, loggedInUser }) => {
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [imageFiles, setImageFiles] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [editingProduct, setEditingProduct] = useState(null)
  
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (location.state && location.state.product) {
      const { product } = location.state
      setEditingProduct(product)
      setTitle(product.title)
      setPrice(product.price)
      setDescription(product.description)
      setCategory(product.category)
      setImagePreviews(product.images || [])
    }
  }, [location.state])

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    
    if (imageFiles.length + files.length > 5) {
      alert('Maximum 5 images allowed')
      return
    }
    
    setImageFiles((prev) => [...prev, ...files])
    
    const previews = files.map((file) => URL.createObjectURL(file))
    setImagePreviews((prev) => [...prev, ...previews])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!loggedInUser) {
      alert('Please login to add a listing')
      return
    }

    if (!title || !price || !category) {
      alert('Please fill in all required fields')
      return
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('category', category);
    
    imageFiles.forEach(file => {
      formData.append('images', file);
    });

    try {
      if (editingProduct) {
        if (imageFiles.length === 0) {
          imagePreviews.forEach(url => formData.append('images', url));
        }
        await productsAPI.update(editingProduct._id, formData);
        alert('Product updated successfully and sent for re-approval!');
      } else {
        await onAddProduct(formData);
      }
      navigate('/profile');
    } catch (error) {
      console.error('Failed to submit product:', error);
      alert('Failed to submit product. Please try again.');
    }
  }

  return (
    <Box sx={{ padding: { xs: 2, sm: 4 }, display: 'flex', justifyContent: 'center' }}>
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: '650px',
          borderRadius: 4,
          padding: { xs: 3, md: 5 },
          boxShadow: '0px 10px 40px rgba(0,0,0,0.06)',
          border: (theme) => `1px solid ${theme.palette.divider}`,
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? 'linear-gradient(145deg, #1e1e1e, #121212)'
              : 'linear-gradient(145deg, #ffffff, #fbfbfb)',
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 1 }}>
          <Typography variant="h4" fontWeight="800" gutterBottom sx={{ letterSpacing: '-0.5px' }}>
            {editingProduct ? 'Edit Your Listing' : 'Create a Listing'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {editingProduct 
              ? 'Modify the details of your listing below. All listings are subject to admin review.'
              : 'Submit your product information to put it up for sale on campus. All listings are reviewed.'}
          </Typography>
        </Box>

        <TextField
          label="Product Title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              backgroundColor: (theme) =>
                theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
            },
          }}
        />

        <TextField
          label="Price"
          type="number"
          fullWidth
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          InputProps={{
            startAdornment: <InputAdornment position="start">₹</InputAdornment>,
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              backgroundColor: (theme) =>
                theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
            },
          }}
        />

        <TextField
          select
          label="Category"
          fullWidth
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              backgroundColor: (theme) =>
                theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
            },
          }}
        >
          {Object.keys(categories).map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Description"
          multiline
          rows={4}
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              backgroundColor: (theme) =>
                theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
            },
          }}
        />

        {/* Custom Dotted Drag-Drop Upload Area */}
        <Box
          component="label"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px dashed',
            borderColor: (theme) =>
              theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)',
            borderRadius: 3,
            padding: 4,
            cursor: 'pointer',
            textAlign: 'center',
            bgcolor: 'action.hover',
            transition: 'border-color 0.2s, background-color 0.2s',
            "&:hover": {
              borderColor: 'primary.main',
              bgcolor: (theme) =>
                theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.04)' : 'rgba(25, 118, 210, 0.02)',
            },
          }}
        >
          <input
            type="file"
            hidden
            accept="image/*"
            multiple
            onChange={handleImageUpload}
          />
          <AddPhotoAlternateIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1.5 }} />
          <Typography variant="subtitle1" fontWeight="bold">
            Upload Product Images
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
            Up to 5 images allowed (PNG, JPG, WEBP)
          </Typography>
        </Box>

        {/* Thumbnail Previews Grid */}
        {imagePreviews.length > 0 && (
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 1 }}>
            {imagePreviews.map((img, idx) => (
              <Box
                key={idx}
                component="img"
                src={img}
                alt={`Preview ${idx}`}
                sx={{
                  width: 90,
                  height: 90,
                  objectFit: 'cover',
                  borderRadius: 3,
                  boxShadow: '0px 2px 10px rgba(0,0,0,0.08)',
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                }}
              />
            ))}
          </Box>
        )}

        {/* Action Submit Button */}
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            borderRadius: 3,
            paddingY: 1.8,
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
          {editingProduct ? 'Resubmit Listing' : 'Post Item'}
        </Button>
      </Paper>
    </Box>
  )
}

export default AddListing