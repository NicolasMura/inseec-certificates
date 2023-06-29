import { RequestHandler } from 'express';

const postRoot: RequestHandler = (req, res) => {
  res.status(200).json({ message: 'OK'});
}

export default postRoot;
