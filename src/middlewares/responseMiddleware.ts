import { Request, Response, NextFunction } from 'express';

export const responseMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const responseType = req.accepts(['json', 'html']);
  if (responseType === 'json') {
    res.status(req.status? req.status:200).json(req.customData || { message: 'No data available' });
  } else if (responseType === 'html') {
    if (req.viewName) {
      res.render(req.viewName, req.customData);
    } else {
      res.status(500).send('View not specified');
    }
  } else {
    res.status(406).send('Not Acceptable');
  }
};
