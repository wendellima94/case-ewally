import {
  identifyTypeCode,
  ConvertTypedLineToBarcode,
  typeableLineBarcode,
  identifyDate,
  validateCodeWithVerifyingDigit,
  identifyTypeOfTicket,
  identifyValue,
} from "./functions";
import { clean, billetCollection, BankSlip } from "./validate";

// ============= Obter dados do boleto =============
interface IRESPONSE {
  sucess: boolean;
  inputCode: any;
  message: string;
  typeInputCode: string;
  ticketType: string | any;
  codeBar: any;
  digitableLine: any;
  dueDate: any | Date;
  value: number;
}
export const ticketData = (code: any) => {
  let resp: IRESPONSE = {
    sucess: false,
    inputCode: "",
    message: "",
    typeInputCode: "",
    ticketType: "",
    codeBar: "",
    digitableLine: "",
    dueDate: "",
    value: 0,
  };
  code = code.replace(/[^0-9]/g, "");

  let codeType = identifyTypeCode(code);

  if (code.length == 36) {
    code = code + "00000000000";
  } else if (code.length == 46) {
    code = code + "0";
  }

  if (
    code.length != 44 &&
    code.length != 46 &&
    code.length != 47 &&
    code.length != 48
  ) {
    resp.sucess = false;
    resp.inputCode = code;
    resp.message =
      "O código inserido possui " +
      code.length +
      " dígitos. Por favor insira uma numeração válida.";
  } else if (
    code.substr(0, 1) == "8" &&
    code.length == 46 &&
    code.length == 47
  ) {
    resp.sucess = false;
    resp.inputCode = code;
    resp.message =
      "Este tipo de boleto deve possuir um código de barras 44 caracteres numéricos. Ou linha digitável de 48 caracteres numéricos.";
  } else if (!validateCodeWithVerifyingDigit(code, codeType)) {
    resp.sucess = false;
    resp.inputCode = code;
    resp.message =
      "A validação do dígito verificador falhou. Tem certeza que inseriu a numeração correta?";
  } else {
    resp.sucess = true;
    resp.inputCode = code;
    resp.message = "Boleto válido";

    switch (codeType) {
      case "LINHA_DIGITAVEL":
        resp.typeInputCode = "LINHA_DIGITAVEL";
        resp.ticketType = identifyTypeOfTicket(code);
        resp.codeBar = ConvertTypedLineToBarcode(code);
        resp.digitableLine = code;
        resp.dueDate = identifyDate(code, "LINHA_DIGITAVEL");
        resp.value = identifyValue(code, "LINHA_DIGITAVEL");
        break;
      case "CODIGO_DE_BARRAS":
        resp.typeInputCode = "CODIGO_DE_BARRAS";
        resp.ticketType = identifyTypeOfTicket(code);
        resp.codeBar = code;
        resp.digitableLine = typeableLineBarcode(code, false);
        resp.dueDate = identifyDate(code, "CODIGO_DE_BARRAS");
        resp.value = identifyValue(code, "CODIGO_DE_BARRAS");
        break;
      default:
        break;
    }
  }

  return resp;
};

// ============= Fazer validação do boleto =============
export const validateTicket = (code: any, validateBlock = false) => {
  const cod = clean(code);
  if (Number(cod[0]) === 8) return billetCollection(cod, validateBlock);
  return BankSlip(cod, validateBlock);
};
