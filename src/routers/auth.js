import { Router } from 'express';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import validateBody from '../utils/validateBody.js';
import { userSigninSchema, userSignupSchema } from '../validation/users.js';
import {
  getGoogleOAuthUrlController,
  loginController,
  loginWithGoogleController,
  logoutController,
  refreshController,
  registerController,
  requestResetEmailController,
  resetPasswordController,
} from '../controllers/auth.js';
import {
  loginWithGoogleOAuthSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
} from '../validation/auth.js';

const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(userSignupSchema),
  ctrlWrapper(registerController),
);

authRouter.post(
  '/login',
  validateBody(userSigninSchema),
  ctrlWrapper(loginController),
);

authRouter.post('/refresh', ctrlWrapper(refreshController));
authRouter.post('/logout', ctrlWrapper(logoutController));

authRouter.post(
  '/request-reset-email',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetEmailController),
);

authRouter.post(
  '/reset-password',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);

authRouter.get('/get-auth-url', ctrlWrapper(getGoogleOAuthUrlController));

authRouter.post(
  '/confirm-oauth',
  validateBody(loginWithGoogleOAuthSchema),
  ctrlWrapper(loginWithGoogleController),
);

export default authRouter;
