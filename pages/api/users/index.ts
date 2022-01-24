import type { NextApiRequest, NextApiResponse } from 'next';
import { clearUsers, getUsers, insertUsers } from '../../../db/user.db';
import { mockUsers } from '../../../db/user.mock.db';

type Data = {
  success?: boolean;
  message?: string;
  data?: any;
};

const createUsers = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    await clearUsers();
    await insertUsers(mockUsers);
    res
      .status(201)
      .json({ success: true, message: 'Insert users successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Something went wrong' });
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'POST') {
    await createUsers(req, res);
  }
  if (req.method === 'GET') {
    const users = await getUsers();
    res.status(200).json({ success: true, data: users });
  }
}
