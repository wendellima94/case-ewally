// import {validateTicket, ticketData} from './index';

// let ticketCode = "83860000005096000190000008017823000034306271"// retorna true
// // let ticketCode = "23797000000000000004150090019801673500021140" // retorna true


// let validate = validateTicket(ticketCode)
// let data = ticketData(ticketCode)

// console.log(validate)
// console.log("\n")
// console.log(data)

import express from 'express';
import { router } from './routes/route';

const app = express();

app.use(express.json());
app.use(router)

const port = 4000 || 3333 || 8080;

app.listen(port, () => {
  console.log(`Listening to port ${port}...`);
});