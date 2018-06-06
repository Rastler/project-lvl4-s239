#!/usr/bin/env node
import app from '..';

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log('Server listening on port ', port);
});
