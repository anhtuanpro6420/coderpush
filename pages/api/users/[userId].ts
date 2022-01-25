import type { NextApiRequest, NextApiResponse } from 'next';
import { getUserById } from '../../../db/user.db';
import { IResponse } from '../../../types/common.interface';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IResponse>
) {
  if (req.method === 'GET') {
    try {
      const userId: string = req.query.userId as string;
      const user = await getUserById(userId);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: 'User not found' });
      }
      return res.status(200).json({ success: true, data: user });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: 'Something went wrong' });
    }
  }
}
