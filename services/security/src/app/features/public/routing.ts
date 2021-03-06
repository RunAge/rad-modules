import * as express from "express";
import { CommandBus } from "../../../../../../shared/command-bus";
import { Request, Response, NextFunction } from "express";
import { OauthProvider } from "../../../config/config";
import { loginAction, loginActionValidation } from "../users/actions/login.action";
import { refreshTokenAction, refreshTokenActionValidation } from "../users/actions/refresh-token.action";
import { oauthRedirectAction, oauthRedirectActionDefaultValidation } from "../users/actions/oauth-redirect.action";
import { passwordResetTokenAction, passwordResetTokenActionValidation } from "./actions/password-reset-token.action";
import { resetPasswordAction, resetPasswordActionValidation } from "./actions/reset-password.action";
import { Logger } from "winston";
import { loginGoogleIdTokenAction, loginGoogleIdTokenActionValidation } from "./actions/login-google-id-token.action";
// COMMAND_IMPORTS

export interface PublicRoutingProps {
  commandBus: CommandBus;
  logger: Logger;
}

export const publicRouting = ({ commandBus, logger }: PublicRoutingProps) => {
  const router = express.Router();

  router.post(
    "/auth/reset-password",
    [passwordResetTokenActionValidation],
    passwordResetTokenAction({ commandBus, logger }),
  );
  router.post(
    "/auth/reset-password/:resetPasswordToken",
    [resetPasswordActionValidation],
    resetPasswordAction({ commandBus }),
  );
  router.post("/auth/login", [loginActionValidation], loginAction({ commandBus }));
  router.get(
    ["/auth/oauth-redirect", "/auth/oauth-redirect/:provider"],
    [
      (req: Request, res: Response, next: NextFunction) => {
        if (!req.params.provider) {
          req.params.provider = OauthProvider.GOOGLE;
        }
        next();
      },
      oauthRedirectActionDefaultValidation,
    ],
    oauthRedirectAction({ commandBus }),
  );
  router.post("/auth/refresh-token", [refreshTokenActionValidation], refreshTokenAction({ commandBus }));
  router.post(
    "/auth/login/google-id-token",
    [loginGoogleIdTokenActionValidation],
    loginGoogleIdTokenAction({ commandBus }),
  );
  // COMMANDS_SETUP

  return router;
};
