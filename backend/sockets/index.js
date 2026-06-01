module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        // Room Events
        socket.on('join-room', (data) => {
            const { roomCode, username } = data;
            socket.join(roomCode);
            socket.to(roomCode).emit('player-joined', { username, message: `${username} has joined the room.` });
            console.log(`${username} joined room ${roomCode}`);
        });

        socket.on('leave-room', (data) => {
            const { roomCode, username } = data;
            socket.leave(roomCode);
            socket.to(roomCode).emit('player-left', { username, message: `${username} has left the room.` });
            console.log(`${username} left room ${roomCode}`);
        });

        // Chat Events
        socket.on('chat-message', (data) => {
            const { roomCode, username, message } = data;
            // Broadcast message to everyone in the room
            io.to(roomCode).emit('chat-message', { username, message, timestamp: new Date() });
        });

        // Game State Events
        socket.on('start-game', (data) => {
            const { roomCode, imposterUsername } = data;
            
            io.to(roomCode).emit('start-game', { message: 'The game has started!' });
            
            // In a real scenario, emit to specific sockets to keep roles hidden
            io.to(roomCode).emit('assign-role', { imposterUsername });
        });

        socket.on('submit-clue', (data) => {
            const { roomCode, username, clueText } = data;
            io.to(roomCode).emit('submit-clue', { username, clueText });
        });

        socket.on('cast-vote', (data) => {
            const { roomCode, voterUsername, votedForUsername } = data;
            io.to(roomCode).emit('cast-vote', { voterUsername, votedForUsername });
        });

        socket.on('round-ended', (data) => {
            const { roomCode, eliminatedUsername, isImposter } = data;
            io.to(roomCode).emit('round-ended', { 
                eliminatedUsername, 
                isImposter,
                message: `${eliminatedUsername} was eliminated. They were ${isImposter ? 'the imposter!' : 'a crewmate.'}`
            });
        });

        socket.on('game-ended', (data) => {
            const { roomCode, winner } = data;
            io.to(roomCode).emit('game-ended', { 
                winner,
                message: `Game Over! The ${winner} won!`
            });
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
};
