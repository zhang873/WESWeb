var socket = io.connect();


socket.on('open', function (data) {
  console.log('open');
  //socket.emit('my other event', { my: 'data' });
});

socket.on('news', function (data) {
  console.log(data);
  //socket.emit('my other event', { my: 'data' });
});
socket.on('changed', function (data) {
  console.log(data);
  //socket.emit('my other event', { my: 'data' });
});