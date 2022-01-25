import type { NextApiRequest, NextApiResponse } from 'next';
import { getRandomUser } from '../../../db/user.db';
import { IResponse } from '../../../types/common.interface';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IResponse>
) {
  if (req.method === 'GET') {
    const user = await getRandomUser();
    return res.status(200).json({
      success: true,
      data: user,
    });
  }
}
