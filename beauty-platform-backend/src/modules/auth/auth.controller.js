const authService = require('./auth.service');

exports.adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    console.log("BODY:", req.body);
    if (!email || typeof email !== 'string' || email.trim() === '') {
      return res.status(400).json({ message: "Valid email is required" });
    }

    // ✅ Basic validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const data = await authService.adminLoginService(email, password);

    return res.status(200).json({
      message: "Login successful",
      ...data,
    });

  } catch (error) {
    next(error);
  }
};



exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        message: "Refresh token required",
      });
    }

    const data = await authService.refreshTokenService(refreshToken);

    return res.status(200).json(data);

  } catch (error) {
    next(error);
  }
};


exports.logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    await authService.logoutService(refreshToken);

    res.status(200).json({
      message: "Logged out successfully",
    });

  } catch (error) {
    next(error);
  }
};