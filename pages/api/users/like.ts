import type { NextApiRequest, NextApiResponse } from 'next';
import { passUser } from '../../../db/user.db';
import { IResponse } from '../../../types/common.interface';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IResponse>
) {
  if (req.method === 'POST') {
    try {
      const {
        body: { userId, reactedUserId },
      } = req || {};
      await passUser(userId, reactedUserId);
      return res.status(200).json({
        success: true,
        data: {},
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
