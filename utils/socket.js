module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('Usuario conectado');

    socket.on('disconnect', () => {
      console.log('Usuario desconectado');
    });

    // Escucha eventos y emite cambios según tu lógica de negocio.
  });
};
