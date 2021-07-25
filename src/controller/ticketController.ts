import { Request, Response } from "express";
import { validateTicket, ticketData } from "../index";

export const ticketController = (req: Request, res: Response) => {
  // const ticketCode = req.params;

// Número do boleto para teste no terminal
// O número pode conter pontos e espaços pois serão tratados
  // let ticketCode = "123482938102381039810293810938093819023810982309182301238109238109328091"// retorna false
  // let ticketCode = "10499898100000214032006561000100040099726390"//retorna true
  // let ticketCode = "23797000000000000004150090019801673500021140" // retorna true
  let ticketCode = "83860000005096000190000008017823000034306271"// retorna true
  // let ticketCode = "858200000007572503282030560708202107539591904460" // retorna false

  try {
    const validate = validateTicket(ticketCode);
    const data = ticketData(ticketCode);

    if (validate) {
      res.status(200).json(data);
    } else {
      res.status(400).json({
        message: data.message,
      });
    }
    console.log(validate);
    console.log("\n");
    console.log(data);
  } catch (e) {
      console.error(e);
  }
};
