import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import User from '@lib/database/models/User.ts';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  await dbConnect();

  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { username, password }: { username: string; password: string } = req.body;

  const user = await User.findOne({ username });

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
    expiresIn: '1h',
  });

  res.status(200).json({ token });
}
