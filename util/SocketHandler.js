

/**
 * SocketHandler helper class used as a simplified API
 * @param {Object} [options]
 */
class SocketHandler {
  constructor(options) {
    console.log('initializing socket handlers:');

    this.options = { ...options };
    this.io = null;
    this.handlers = [];
    this.rooms = {};

    this.setIo = this.setIo.bind(this);
    this._setHandlers = this._setHandlers.bind(this);

    this.handleEvent = this.handleEvent.bind(this);
    this.makeHandler = this.makeHandler.bind(this);
    this.use = this.use.bind(this);
  }
  /** 
   * bulk add handlers 
   * @param {String} [prefix] route prefix to be used for handler: '/${prefix}/${eventType}'
   * @param {any[]} handlers
  */
  use(prefix, handlers) {
    if (arguments.length === 1) {
      handlers = prefix;
      prefix = '';
    }
    const parsedHandlers = handlers.flat().map(({ eventType, handler }) => ({
      path: prefix ? `${prefix}/${eventType}` : eventType,
      fn: handler
    }));
    this.handlers = this.handlers.concat(parsedHandlers);
  }
  /** returns an event handler
   * @param {String} eventType
   * @param {Function} fn
  */
  makeHandler(eventType, handler) {
    return { eventType, handler };
  }
  /** handles a single event
   * @param {String} eventType
   * @param {Function} fn
  */
  handleEvent(eventType, handler) {
    this.use([this.makeHandler(eventType, handler)])
  }
  /**
   * Sets the io value and initializes the Handler
   * @param {Object} io 
   */
  setIo(io) {
    try {
      this.io = io;
      io.sockets.on('connection', this._setHandlers);
    } catch (e) {
      console.error(`[SocketHandler] Error: ${e}`);
    }
  }
  /**
   * Assigns event handlers for the given socket
   * @param {Object} socket 
   */
  _setHandlers(socket) {
    const { handshake: { url, headers: { host } = {} } = {} } = socket;
    console.log('connection made:', { host, url })
    this.handlers.forEach(({ path, fn }) =>
      socket.on(path, data =>
        fn(data, this.io, socket)
      )
    );
  }
}


export default SocketHandler;