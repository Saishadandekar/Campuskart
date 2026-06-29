import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  TextField,
  InputAdornment,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'

const SearchBar = () => {
  const [searchText, setSearchText] = useState('')
  const navigate = useNavigate()

  const handleSearch = () => {
    if (searchText.trim() !== '') {
      navigate(`/search/${encodeURIComponent(searchText.trim())}`)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handlePostItem = () => {
    navigate('/add')
  }

  return (
    <Box
      sx={{
        width: '100%',
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.01)',
        paddingY: 2.5,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          paddingX: 3,
          width: '100%',
          maxWidth: '1200px',
          gap: 2,
          boxSizing: 'border-box',
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      >
        <TextField
          variant="outlined"
          placeholder="Search for textbooks, calculators, lab coats..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={handleKeyPress}
          fullWidth
          sx={{
            flexGrow: 1,
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              backgroundColor: (theme) =>
                theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.015)',
              "&:hover": {
                backgroundColor: (theme) =>
                  theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.025)',
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            sx: {
              borderRadius: 3,
              height: '48px',
            },
          }}
        />

        <Button
          variant="contained"
          onClick={handleSearch}
          sx={{
            textTransform: 'none',
            borderRadius: 3,
            height: '48px',
            px: 4,
            fontWeight: 'bold',
            boxShadow: 2,
            transition: 'transform 0.2s, box-shadow 0.2s',
            "&:hover": {
              transform: 'translateY(-1px)',
              boxShadow: 4,
            },
            width: { xs: '100%', sm: 'auto' },
            whiteSpace: 'nowrap',
          }}
        >
          Search
        </Button>

        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handlePostItem}
          sx={{
            textTransform: 'none',
            borderRadius: 3,
            height: '48px',
            px: 3,
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            borderWidth: '2px',
            "&:hover": {
              borderWidth: '2px',
              backgroundColor: (theme) =>
                theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.08)' : 'rgba(25, 118, 210, 0.04)',
            },
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          Post an item
        </Button>
      </Box>
    </Box>
  )
}

export default SearchBar
