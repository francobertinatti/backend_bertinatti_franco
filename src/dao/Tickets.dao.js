const TicketsRepositoy = require('./repository/tickets.repository')

async function checkData(code, email, cart){
    const ticketRepository = new TicketsRepositoy()
    return ticketRepository.proccessDataTicket(code, email, cart)
}

module.exports = checkData