import crypto from "crypto"
import genToken from "../config/token.js"
import User from "../models/user.model.js"
import { getFirebaseAuth } from "../config/firebaseAdmin.js"

const hashPassword = (password, salt = null) => {
  const saltValue = salt || crypto.randomBytes(16).toString("hex")
  const hash = crypto.pbkdf2Sync(password, saltValue, 100000, 64, "sha512").toString("hex")
  return { salt: saltValue, hash }
}

const setAuthCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
}

export const googleAuth = async (req, res) => {
  try {
    const { idToken } = req.body
    if (!idToken) {
      return res.status(400).json({ message: "Missing Google ID token." })
    }

    // Trust only identity data from a token that Firebase has signed,
    // never name/email sent directly by the client.
    const firebaseAuth = getFirebaseAuth() // throws (500) if server is misconfigured
    let decoded
    try {
      decoded = await firebaseAuth.verifyIdToken(idToken)
    } catch {
      return res.status(401).json({ message: "Invalid or expired Google sign-in." })
    }

    const { email, email_verified } = decoded
    const name = decoded.name || email?.split("@")[0]
    if (!email || !email_verified) {
      return res.status(401).json({ message: "Google account email is not verified." })
    }

    let user = await User.findOne({ email })
    if (!user) {
      user = await User.create({
        name,
        email,
      })
    }
    let token = await genToken(user._id)
    setAuthCookie(res, token)
    const safeUser = user.toObject()
    delete safeUser.passwordHash
    delete safeUser.salt
    return res.status(200).json(safeUser)
  } catch (error) {
    return res.status(500).json({ message: `Google auth error ${error}` })
  }
}

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required." })
    }
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(409).json({ message: "User already exists." })
    }
    const { salt, hash } = hashPassword(password)
    const user = await User.create({
      name,
      email,
      passwordHash: hash,
      salt,
    })
    const token = await genToken(user._id)
    setAuthCookie(res, token)
    const safeUser = user.toObject()
    delete safeUser.passwordHash
    delete safeUser.salt
    return res.status(201).json(safeUser)
  } catch (error) {
    return res.status(500).json({ message: `Registration error ${error}` })
  }
}

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." })
    }
    const user = await User.findOne({ email })
    if (!user || !user.passwordHash || !user.salt) {
      return res.status(401).json({ message: "Invalid email or password." })
    }
    const { hash } = hashPassword(password, user.salt)
    if (hash !== user.passwordHash) {
      return res.status(401).json({ message: "Invalid email or password." })
    }
    const token = await genToken(user._id)
    setAuthCookie(res, token)
    const safeUser = user.toObject()
    delete safeUser.passwordHash
    delete safeUser.salt
    return res.status(200).json(safeUser)
  } catch (error) {
    return res.status(500).json({ message: `Login error ${error}` })
  }
}

export const logOut = async (req, res) => {
  try {
    await res.clearCookie("token")
    return res.status(200).json({ message: "LogOut Successfully" })
  } catch (error) {
    return res.status(500).json({ message: `Logout error ${error}` })
  }
}
