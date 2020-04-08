import express from 'express';
import logger from '../helpers/logger';
import { getUserProfile } from '../services/userServices';
import auth from '../middlewares/authMiddleware';

let router = express.Router();

/**
 * Get User Profile
 * @api {get} /api/users
 * @apiGroup users
 *
 * @apiHeader {string} BearerToken:JWTToken use bearer token for auth
 *
 * @apiSuccess {number}   status=200
 * @apiSuccess {string}   message="ok"
 * @apiSuccess {Object[]} data
 * @apiSuccess {string}   data.userName
 *
 */
// call auth middleware to decrypt JWT token
router.get('/', auth, (req, res, next) => {
  logger.silly('userRoutes.getUserProfile.start');
  getUserProfile(req.user._id)
    .then(response => {
      logger.silly('userRoute.getUserProfile.success');
      res.send({
        status: 200,
        message: 'ok',
        data: {
          userName: response.name
        }
      });
    })
    .catch(error => {
      logger.error('userRoute.getUserProfile.fail');
      next(error);
    });
});
export default router;
