app.get('/', (req, res) => {
  console.log('Client connected');

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const intervalId = setInterval(() => {
    const date = new Date().toLocaleString();
    res.write(`data: ${date}\n\n`);
  }, 1000);

  res.on('close', () => {
    console.log('Client close connection');
    clearInterval(intervalId);
    res.end();
  });
});
