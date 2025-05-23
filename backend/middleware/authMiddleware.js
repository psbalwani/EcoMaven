// import jwt from 'jsonwebtoken'
// import User from '../models/userModel.js'

// // Protect routes - require authentication
// const protect = async (req, res, next) => {
//   let token

//   // Read JWT from the cookie
//   token = req.cookies.jwt

//   if (token) {
//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123')

//       req.user = await User.findById(decoded.userId).select('-password')

//       next()
//     } catch (error) {
//       console.error(error)
//       res.status(401)
//       throw new Error('Not authorized, token failed')
//     }
//   } else {
//     res.status(401)
//     throw new Error('Not authorized, no token')
//   }
// }

// // Admin middleware
// const admin = (req, res, next) => {
//   if (req.user && req.user.isAdmin) {
//     next()
//   } else {
//     res.status(401)
//     throw new Error('Not authorized as an admin')
//   }
// }

// export { protect, admin }
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

// Protect routes - require authentication
const protect = async (req, res, next) => {
  let token;

  // Read JWT from the cookie
  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');

      req.user = await User.findById(decoded.userId).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Admin middleware
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

export { protect, admin };
