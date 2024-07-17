import { Router } from 'express';
import validateBody from '../utils/validateBody.js';
import { userSignupSchema } from '../validation/users.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import { signupController } from '../controllers/auth.js';

const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(userSignupSchema),
  ctrlWrapper(signupController),
);
export default authRouter;
