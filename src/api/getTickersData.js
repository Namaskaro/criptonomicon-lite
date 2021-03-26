import mitt from 'mitt'
export const emitter = mitt()



const API_KEY =
  "380ec498044c900f249ad39326e8320a2cb4ee09b94afe4dff6911e37ef56bfc";

export const tickersHandlers = new Map(); // {}
const socket = new WebSocket(
  `wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`
);

const AGGREGATE_INDEX = "5";

const INVALID_TICKER = "500"

// socket.addEventListener("message", e => {
//   const { TYPE: type, FROMSYMBOL: currency, PRICE: newPrice } = JSON.parse(
//     e.data
//   );
//   if (type !== AGGREGATE_INDEX || newPrice === undefined) {
//     return;
//   }
 
//   const handlers = tickersHandlers.get(currency) ?? [];
//   handlers.forEach(fn => fn(newPrice));
//   emitter.emit('onMessage', handlers)
// });


socket.addEventListener('message', e => {
    const { TYPE: type, FROMSYMBOL: currency, PRICE: newPrice} = JSON.parse(
        e.data
      );

      const {INFO: wsMessage} = JSON.parse(e.data)
      
     console.log(wsMessage,type)
    if (type !== AGGREGATE_INDEX || newPrice === undefined) {
    return 
    }

    if(type === INVALID_TICKER) {
      return errorMessage
    }

  const handlers = tickersHandlers.get(currency,type) ?? [];
  handlers.forEach(fn => fn(newPrice,type));
  
  // emitter.emit('onSocketMessage', handlers,() => {
  //   if (type === INVALID_TICKER) {
  //     return errorMessage
  //   }
  // }) 
})
export function sendToWebSocket(message) {
  const stringifiedMessage = JSON.stringify(message);

  if (socket.readyState === WebSocket.OPEN) {
    socket.send(stringifiedMessage);
    return;
  }

  socket.addEventListener(
    "open",
    () => {
      socket.send(stringifiedMessage);
    },
    { once: true }
  );
 
}


export default {
    sendToWebSocket,
    tickersHandlers,
    emitter
}