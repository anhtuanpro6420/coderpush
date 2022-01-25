import type { NextApiRequest, NextApiResponse } from 'next';
import {
  DEFAULT_USERS_LIMIT,
  DEFAULT_USERS_PAGE,
} from '../../../constants/user.constant';
import { getUsers } from '../../../db/user.db';
import { IResponse } from '../../../types/common.interface';
import { IUserRequestOptions } from '../../../types/user.interface';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IResponse>
) {
  if (req.method === 'GET') {
    const {
      query: { page = DEFAULT_USERS_PAGE, limit = DEFAULT_USERS_LIMIT },
    } = req || {};
    const options: IUserRequestOptions = {
      page: Number(page),
      limit: Number(limit),
    } as IUserRequestOptions;
    const users = await getUsers(options);
    return res.status(200).json({ success: true, data: users });
  }
}
