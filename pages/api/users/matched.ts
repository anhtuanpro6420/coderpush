import type { NextApiRequest, NextApiResponse } from 'next';
import { getMatchedUsers } from '../../../db/user.db';
import { IResponse } from '../../../types/common.interface';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IResponse>
) {
  if (req.method === 'GET') {
    try {
      const {
        headers: { userid },
      } = req || {};
      const matchedUsers = await getMatchedUsers(userid as string);
      return res.status(200).json({
        success: true,
        data: matchedUsers,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Something went wrong',
        data: [],
      });
    }
  }
}
