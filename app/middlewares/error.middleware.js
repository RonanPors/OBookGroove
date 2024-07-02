export default (err, req, res, next) => {

  let { status, message } = err;

  // if(err.name === 'ValidationError'){
  //   status = 400;
  //   message = err.details.map((detail) => detail.message);
  // }

  if(err.name === 'ErrorApi'){
    return res.status(400).json({error: err.message});
  }

  if (!status) {
    status = 500;
  }

  if (status === 500) {
    res.status(500).json({error: 'Internal Server error, please contact the administrator'});
  }

  return res.status(status).json({ error: message });
};
