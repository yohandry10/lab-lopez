console.error('Trace script loaded: attaching uncaughtException handler');
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION STACK TRACE');
  console.error(err && err.stack ? err.stack : err);
  process.exit(1);
}); 