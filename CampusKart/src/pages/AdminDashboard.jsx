import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import ProductCard from "../components/ProductCard";
import { adminAPI } from "../services/api";

const AdminDashboard = ({ fetchProducts }) => {
  const [filter, setFilter] = useState("pending");
  const [adminProducts, setAdminProducts] = useState([]);
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(null);

  // Fetches products from the API based on the current filter
  const fetchAdminProducts = useCallback(async () => {
    try {
      const response = await adminAPI.getAllProducts(filter);
      setAdminProducts(response.data);
    } catch (error) {
      console.error("Error fetching admin products:", error);
    }
  }, [filter]);

  useEffect(() => {
    fetchAdminProducts();
  }, [fetchAdminProducts]); // Refetches when fetchAdminProducts (and therefore filter) changes

  // Handles changing the filter (Pending, Approved, etc.)
  const handleFilterChange = (event, newFilter) => {
    if (newFilter !== null) setFilter(newFilter);
  };

  // Opens the rejection dialog and sets the product ID
  const handleOpenRejectionDialog = (productId) => {
    setSelectedProductId(productId);
    setRejectionDialogOpen(true);
  };

  // Closes the rejection dialog and resets state
  const handleCloseRejectionDialog = () => {
    setSelectedProductId(null);
    setRejectionDialogOpen(false);
    setRejectionReason("");
  };

  // Generic function to update status (handles both approve and reject)
  const handleUpdateStatus = async (productId, newStatus, reason = "") => {
    try {
      // Sends an object to the API, including the optional rejection reason
      await adminAPI.updateProductStatus(productId, { status: newStatus, rejectionReason: reason });
      fetchAdminProducts(); // Refreshes the admin product list
      if (fetchProducts) fetchProducts(); // Refreshes the global product list if function is provided
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Handles the final "Submit" click from the rejection dialog
  const handleRejectSubmit = () => {
    if (selectedProductId && rejectionReason) {
      handleUpdateStatus(selectedProductId, "rejected", rejectionReason);
      handleCloseRejectionDialog();
    } else {
      // You might want to add some user feedback here if the reason is empty
      console.error("Rejection reason cannot be empty");
    }
  };

  const filteredProducts = adminProducts;

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      <ToggleButtonGroup
        value={filter}
        exclusive
        onChange={handleFilterChange}
        sx={{ marginBottom: 3 }}
      >
        <ToggleButton value="all">All</ToggleButton>
        <ToggleButton value="pending">Pending</ToggleButton>
        <ToggleButton value="active">Approved</ToggleButton>
        <ToggleButton value="rejected">Rejected</ToggleButton>
      </ToggleButtonGroup>

      {filteredProducts.length === 0 ? (
        <Typography>No {filter} listings.</Typography>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 3,
          }}
        >
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id || product.id}
              product={product}
              showStatus
            >
              {/* Show buttons only for pending products */}
              {product.status === "pending" && (
                <Box sx={{ display: "flex", gap: 2, mt: 2, justifyContent: "center" }}>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpdateStatus(product._id, "active");
                    }} // Approves directly
                  >
                    Approve
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenRejectionDialog(product._id);
                    }} // Opens dialog
                  >
                    Reject
                  </Button>
                </Box>
              )}
            </ProductCard>
          ))}
        </Box>
      )}

      {/* Rejection Reason Dialog */}
      <Dialog open={rejectionDialogOpen} onClose={handleCloseRejectionDialog}>
        <DialogTitle>Reject Product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please provide a reason for rejecting this product.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="reason"
            label="Rejection Reason"
            type="text"
            fullWidth
            variant="standard"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRejectionDialog}>Cancel</Button>
          <Button onClick={handleRejectSubmit} disabled={!rejectionReason}>Submit</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;