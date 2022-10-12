# Proyect Bingo

Un proyecto para practicar TypeScript, Express y Socket.io

La idea es replicar el juego con un multijugador local
Brindando las de los jugadores y el control del juego con Express
y actualizando los datos de la partida en tiempo real con Socket.io.

## Rutas

El servidor nos va a lanzar las dos vistas mediante express

### Vista del cliente

> {host}:{port}/

La ruta predeterminada será la vista de nuestro jugador
que tiene un cartón de Bingo con los números.

### Vista del admin

> localhost:{puerto}/admin

La ruta de /admin permitirá iniciar el juego y ver los jugadores
que hay conectados.

## Comandos

```Bash
npm run start
```

Arrancamos el servidor con node

```Bash
npm run start
```

Arrancamos el servidor con nodemon
