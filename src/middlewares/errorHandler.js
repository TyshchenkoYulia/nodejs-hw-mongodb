import { HttpError } from 'http-errors';

const errorHandler = (error, reg, res, next) => {
  if (error instanceof HttpError) {
    res.status(error.status).json({
      status: error.status,
      message: error.name,

      data: { message: 'Contact not found' },
    });
    return;
  }

  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    data: error.message,
  });
};
export default errorHandler;
