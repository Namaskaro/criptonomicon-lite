import {tickersHandlers,sendToWebSocket, emitter} from '../api/getTickersData'

function subscribeToTickerOnWs(ticker) {
    sendToWebSocket({
      action: "SubAdd",
      subs: [`5~CCCAGG~${ticker}~USD`]
    }
    );
  }


 export  const subscribeToTicker = (ticker, cb) => {
    const subscribers = tickersHandlers.get(ticker) || [];
    tickersHandlers.set(ticker, [...subscribers, cb]);
    subscribeToTickerOnWs(ticker);
    emitter.on('onSocketMessage', (handlers) => {
      console.log(handlers)
    })
  };



 