import type { NextApiRequest, NextApiResponse } from 'next';
import {
  DEFAULT_USERS_LIMIT,
  DEFAULT_USERS_PAGE,
} from '../../../constants/user.constant';
import { getAllUsers, getUsers } from '../../../db/user.db';
import { IResponse } from '../../../types/common.interface';
import { IUserRequestOptions } from '../../../types/user.interface';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IResponse>
) {
  if (req.method === 'GET') {
    try {
      const {
        query: { page = DEFAULT_USERS_PAGE, limit = DEFAULT_USERS_LIMIT },
      } = req || {};
      const options: IUserRequestOptions = {
        page: Number(page),
        limit: Number(limit),
      } as IUserRequestOptions;
      const users = await getUsers(options);
      const allUsers = await getAllUsers();
      const total: number = (allUsers && allUsers.length) || 0;
      return res.status(200).json({
        success: true,
        data: {
          users,
          total,
          page,
          limit,
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Something went wrong',
        data: {},
      });
    }
  }
}
