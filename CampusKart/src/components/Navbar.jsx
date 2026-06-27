import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  AccountCircle,
  Brightness4,
  Brightness7,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import categories from "../data/categories";

const Navbar = ({
  loggedInUser,
  setLoggedInUser,
  darkMode,
  setDarkMode,
  setToast,
}) => {

  const [loginOpen, setLoginOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/search/${encodeURIComponent(category)}`);
  };

  const handleLoginOpen = () => setLoginOpen(true);
  const handleLoginClose = () => setLoginOpen(false);
  const handleTabChange = (event, newValue) => setTabIndex(newValue);

  const handleSubmit = async () => {
    try {
      const { authAPI } = await import("../services/api");

      if (tabIndex === 0) {
        // Login
        const response = await authAPI.login({ email, password });
        const userData = response.data;

        // Store token and user data
        localStorage.setItem("token", userData.token);
        setLoggedInUser({
          _id: userData._id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          avatar: userData.avatar,
        });

        setLoginOpen(false);
        setEmail("");
        setPassword("");

        if (userData.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }

        setToast?.({
          open: true,
          message: "Login successful!",
          severity: "success",
        });
      } else {
        // Register
        if (registerPassword !== registerConfirmPassword) {
          setToast?.({
            open: true,
            message: "Passwords do not match",
            severity: "error",
          });
          return;
        }

        // Check if email is a valid Thakur College email
        if (!registerEmail.toLowerCase().endsWith("@tcetmumbai.in")) {
          setToast?.({
            open: true,
            message: "Please use a valid Thakur College email (@tcetmumbai.in)",
            severity: "error",
          });
          return;
        }

        const response = await authAPI.register({
          name: registerName,
          email: registerEmail,
          password: registerPassword,
        });
        const userData = response.data;

        // Store token and user data
        localStorage.setItem("token", userData.token);
        setLoggedInUser({
          _id: userData._id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          avatar: userData.avatar,
        });

        setLoginOpen(false);
        setEmail("");
        setPassword("");
        setRegisterName("");
        setRegisterEmail("");
        setRegisterPassword("");
        setRegisterConfirmPassword("");
        navigate("/");

        setToast?.({
          open: true,
          message: "Registration successful!",
          severity: "success",
        });
      }
    } catch (error) {
      console.error("Auth error:", error);
      setToast?.({
        open: true,
        message: error.response?.data?.message || "Authentication failed",
        severity: "error",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedInUser(null);
    navigate("/");
    setToast?.({
      open: true,
      message: "Logged out successfully",
      severity: "success",
    });
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Left: Logo */}
          <Box
            component={Link}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: "inherit",
              gap: 1,
            }}
          >
            <Box
              component="img"
              src="/logo.png"
              alt="CampusKart Logo"
              sx={{ width: 60, height: 60, objectFit: "contain" }}
            />
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              CampusKart
            </Typography>
          </Box>

          <Box
            sx={{ flexGrow: 1, display: "flex", justifyContent: "center", gap: 2 }}
          >
            {Object.keys(categories).map((cat) => (
              <Button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                sx={{
                  fontWeight: "bold",
                  textTransform: "none",
                  fontSize: "1.05rem",
                  color: "text.primary",
                  "&:hover": {
                    color: "primary.main",
                  },
                }}
              >
                {cat}
              </Button>
            ))}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>

            {loggedInUser ? (
              <>
                <Typography variant="body1">Hi, {loggedInUser.name}</Typography>
                {loggedInUser.role === "admin" && (
                  <Button
                    variant="contained"
                    onClick={() => navigate("/admin")}
                    sx={{
                      backgroundColor: "#4682b4",
                      "&:hover": { backgroundColor: "#3a6d9a" },
                    }}
                  >
                    Admin Panel
                  </Button>
                )}
                <IconButton color="primary" onClick={handleProfileClick}>
                  <AccountCircle />
                </IconButton>
                <Button variant="outlined" onClick={handleLogout}>
                  Log Out
                </Button>
              </>
            ) : (
              <Button variant="outlined" onClick={handleLoginOpen}>
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Dialog open={loginOpen} onClose={handleLoginClose} maxWidth="xs" fullWidth>
        <DialogTitle>{tabIndex === 0 ? "Login" : "Sign Up"}</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <Tabs value={tabIndex} onChange={handleTabChange} centered>
            <Tab label="Login" />
            <Tab label="Sign Up" />
          </Tabs>

          {tabIndex === 0 && (
            <>
              <TextField
                label="Email"
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </>
          )}

          {tabIndex === 1 && (
            <>
              <TextField
                label="Full Name"
                fullWidth
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
              />
              <TextField
                label="Email"
                type="email"
                fullWidth
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
              />
              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                fullWidth
                value={registerConfirmPassword}
                onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleLoginClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {tabIndex === 0 ? "Log In" : "Sign Up"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Navbar;