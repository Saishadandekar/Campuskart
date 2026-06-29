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
  Avatar,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  AccountCircle,
  LightMode,
  DarkMode,
  Close,
  LockOutlined,
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
              {darkMode ? <LightMode /> : <DarkMode />}
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

      <Dialog
        open={loginOpen}
        onClose={handleLoginClose}
        maxWidth="xs"
        fullWidth
        slotProps={{
          backdrop: {
            sx: {
              backdropFilter: "blur(6px)",
              backgroundColor: "rgba(0, 0, 0, 0.4)",
            },
          },
        }}
        PaperProps={{
          sx: {
            borderRadius: 5,
            padding: 4,
            boxShadow: "0px 10px 40px rgba(0,0,0,0.2)",
            position: "relative",
            background: (theme) =>
              theme.palette.mode === "dark"
                ? "linear-gradient(145deg, #1e1e1e, #121212)"
                : "linear-gradient(145deg, #ffffff, #fcfcfc)",
          },
        }}
      >
        {/* Close Button in top right */}
        <IconButton
          onClick={handleLoginClose}
          sx={{
            position: "absolute",
            right: 16,
            top: 16,
            color: "text.secondary",
            "&:hover": {
              color: "text.primary",
              backgroundColor: "action.hover",
            },
          }}
        >
          <Close />
        </IconButton>

        {/* Branding/Header */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 1,
            mb: 3,
            textAlign: "center",
          }}
        >
          <Avatar
            sx={{
              bgcolor: "primary.main",
              width: 56,
              height: 56,
              mb: 1.5,
              boxShadow: (theme) =>
                theme.palette.mode === "dark"
                  ? "0px 4px 20px rgba(144, 202, 249, 0.3)"
                  : "0px 4px 20px rgba(25, 118, 210, 0.2)",
            }}
          >
            <LockOutlined sx={{ fontSize: 28 }} />
          </Avatar>
          <Typography variant="h5" fontWeight="800" sx={{ letterSpacing: "-0.5px" }}>
            {tabIndex === 0 ? "Welcome Back" : "Create Account"}
          </Typography>
          {tabIndex === 1 && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, px: 2 }}>
              Register with your Thakur College email to get started.
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 3,
          }}
        >
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              minHeight: 40,
              height: 40,
              width: "100%",
              backgroundColor: (theme) =>
                theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
              borderRadius: "20px",
              padding: "4px",
              "& .MuiTabs-indicator": {
                height: "100%",
                borderRadius: "18px",
                backgroundColor: "background.paper",
                boxShadow: "0px 2px 8px rgba(0,0,0,0.08)",
              },
            }}
          >
            <Tab
              label="Login"
              disableRipple
              sx={{
                minHeight: 32,
                height: 32,
                textTransform: "none",
                fontWeight: "bold",
                borderRadius: "18px",
                transition: "color 0.2s ease",
                zIndex: 1,
                "&.Mui-selected": {
                  color: "primary.main",
                },
              }}
            />
            <Tab
              label="Sign Up"
              disableRipple
              sx={{
                minHeight: 32,
                height: 32,
                textTransform: "none",
                fontWeight: "bold",
                borderRadius: "18px",
                transition: "color 0.2s ease",
                zIndex: 1,
                "&.Mui-selected": {
                  color: "primary.main",
                },
              }}
            />
          </Tabs>
        </Box>

        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            padding: 0,
            overflow: "visible",
          }}
        >
          {tabIndex === 0 && (
            <>
              <TextField
                label="Email"
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    backgroundColor: (theme) =>
                      theme.palette.mode === "dark" ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)",
                    "&:hover": {
                      backgroundColor: (theme) =>
                        theme.palette.mode === "dark" ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)",
                    },
                  },
                }}
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
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    backgroundColor: (theme) =>
                      theme.palette.mode === "dark" ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)",
                    "&:hover": {
                      backgroundColor: (theme) =>
                        theme.palette.mode === "dark" ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)",
                    },
                  },
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
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    backgroundColor: (theme) =>
                      theme.palette.mode === "dark" ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)",
                    "&:hover": {
                      backgroundColor: (theme) =>
                        theme.palette.mode === "dark" ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)",
                    },
                  },
                }}
              />
              <TextField
                label="Email"
                type="email"
                fullWidth
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    backgroundColor: (theme) =>
                      theme.palette.mode === "dark" ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)",
                    "&:hover": {
                      backgroundColor: (theme) =>
                        theme.palette.mode === "dark" ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)",
                    },
                  },
                }}
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
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    backgroundColor: (theme) =>
                      theme.palette.mode === "dark" ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)",
                    "&:hover": {
                      backgroundColor: (theme) =>
                        theme.palette.mode === "dark" ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)",
                    },
                  },
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
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    backgroundColor: (theme) =>
                      theme.palette.mode === "dark" ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)",
                    "&:hover": {
                      backgroundColor: (theme) =>
                        theme.palette.mode === "dark" ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)",
                    },
                  },
                }}
              />
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ flexDirection: "column", gap: 1.5, mt: 3, p: 0 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            sx={{
              borderRadius: 3,
              paddingY: 1.5,
              fontWeight: "bold",
              textTransform: "none",
              fontSize: "1rem",
              boxShadow: (theme) =>
                theme.palette.mode === "dark"
                  ? "0px 4px 20px rgba(144, 202, 249, 0.3)"
                  : "0px 4px 20px rgba(25, 118, 210, 0.2)",
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? "linear-gradient(45deg, #90caf9, #64b5f6)"
                  : "linear-gradient(45deg, #1976d2, #1e88e5)",
              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: (theme) =>
                  theme.palette.mode === "dark"
                    ? "0px 6px 24px rgba(144, 202, 249, 0.4)"
                    : "0px 6px 24px rgba(25, 118, 210, 0.3)",
              },
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
          >
            {tabIndex === 0 ? "Log In" : "Sign Up"}
          </Button>

          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            {tabIndex === 0 ? (
              <>
                New to CampusKart?{" "}
                <Button
                  variant="text"
                  size="small"
                  onClick={() => setTabIndex(1)}
                  sx={{
                    p: 0,
                    minWidth: 0,
                    textTransform: "none",
                    fontWeight: "bold",
                    fontSize: "inherit",
                  }}
                >
                  Sign Up
                </Button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Button
                  variant="text"
                  size="small"
                  onClick={() => setTabIndex(0)}
                  sx={{
                    p: 0,
                    minWidth: 0,
                    textTransform: "none",
                    fontWeight: "bold",
                    fontSize: "inherit",
                  }}
                >
                  Log In
                </Button>
              </>
            )}
          </Typography>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Navbar;