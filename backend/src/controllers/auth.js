import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken } from '../utils/tokenUtils.js';
import User from '../models/user.model.js';
import { googleClientId } from '../utils/constant.js';
import { OAuth2Client } from 'google-auth-library'


// ============> Get user details <==========
export const getUser = async (req, res) => {
  let user;
  if (req.user.email) {
    user = { _id: req.user._id, email: req.user.email, user_type: req.user.user_type }
  } else if (req.user.username) {
    user = { _id: req.user._id, username: req.user.username, user_type: req.user.user_type }
  }
  res.json(user);
};

// ============> Firebase login <============
const verifyGoogleToken = async (tokenId, GOOGLE_CLIENT_ID) => {
  const client = new OAuth2Client(GOOGLE_CLIENT_ID); // Replace with your Google Client ID
  const ticket = await client.verifyIdToken({
    idToken: tokenId,
    audience: GOOGLE_CLIENT_ID, // Replace with your Google Client ID
  });
  const payload = ticket.getPayload();
  console.log(payload);


  return payload;
}

export const googleLogin = async (req, res) => {
  const { tokenId } = req.body;
  console.log(tokenId);

  try {
    const payload = await verifyGoogleToken(tokenId, googleClientId);
    let user = await User.findOne({ email: payload.email });

    if (!user) {
      user = new User({
        email: payload.email,
      });
      await user.save();
    }

    const tokenPayload = { id: user._id, email: user.email };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: 3600000,
      secure: true,
      sameSite: 'None'
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 259200000,
      secure: true,
      sameSite: 'None'
    });

    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(401).json({ message: 'Invalid Google token' });
  }
}

// ============> Credential login <===========
export const credentialLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Fetch user data from MongoDB
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid Credentials' });
    }
    console.log(user, 'test 1');

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid Credentials' });
    }

    // Create a payload for the JWT token
    const tokenPayload = { id: user._id, username: user.username };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Set cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: 3600000, // 1 hour
      secure: true,   // Set to true in production with HTTPS
      sameSite: 'None' // Set 'SameSite' to 'None' for cross-site cookies
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 259200000, // 30 days
      secure: true,   // Set to true in production with HTTPS
      sameSite: 'None' // Set 'SameSite' to 'None' for cross-site cookies
    });

    res.json({ message: 'Login successful' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// ============> Credential signup <===========
export const credentialSignup = async (req, res) => {
  try {
    const { username, password } = req.body;


    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new user
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// ============> Logout <==========
export const logout = async (req, res) => {
  res.cookie('accessToken', null, {
    httpOnly: true,
    maxAge: -1, // Immediate expiration
    secure: true,   // Set to true in production with HTTPS
    sameSite: 'None' // Set 'SameSite' to 'None' for cross-site cookies
  });
  res.cookie('refreshToken', null, {
    httpOnly: true,
    maxAge: -1,
    secure: true,   // Set to true in production with HTTPS
    sameSite: 'None' // Set 'SameSite' to 'None' for cross-site cookies
  });
  res.json({ message: 'Logout successful' });
};


