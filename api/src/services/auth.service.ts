import { User } from "../models/User.js";
import { hashPassword, verifyPassword } from "../utils/hash.js";
import { signToken } from "../utils/jwt.js";
import { AppError } from "../utils/AppError.js";
import type { RegisterInput, LoginInput } from "../validators/auth.validator.js";

export async function registerUser(input: RegisterInput) {
  const existing = await User.findOne({ email: input.email });
  if (existing) throw new AppError("An account with that email already exists.", 409);

  const passwordHash = await hashPassword(input.password);
  const user = await User.create({ name: input.name, email: input.email, passwordHash });
  const token = signToken(user._id.toString());

  return { token, user: { id: user._id, name: user.name, email: user.email } };
}

export async function loginUser(input: LoginInput) {
  const user = await User.findOne({ email: input.email }).select("+passwordHash");
  if (!user) throw new AppError("Incorrect email or password.", 401);

  const valid = await verifyPassword(user.passwordHash, input.password);
  if (!valid) throw new AppError("Incorrect email or password.", 401);

  const token = signToken(user._id.toString());
  return { token, user: { id: user._id, name: user.name, email: user.email } };
}

export async function getCurrentUser(userId: string) {
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found.", 404);
  return { id: user._id, name: user.name, email: user.email };
}
