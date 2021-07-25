// identificar tipo de codigo de boleto
export function identifyTypeCode(code: any) {
  code = code.replace(/[^0-9]/g, "");

  if (typeof code !== "string")
    throw new TypeError(" Insira uma string válida!");

  if (code.length == 44) {
    return "CODIGO_DE_BARRAS";
  } else if (code.length == 46 || code.length == 47 || code.length == 48) {
    return "LINHA_DIGITAVEL";
  } else {
    return "TAMANHO_INCORRETO";
  }
}

// Identificar tipo de boleto inserido
export function identifyTypeOfTicket(code: any) {
  code = code.replace(/[^0-9]/g, "");

  if (typeof code !== "string")
    throw new TypeError("Insira uma string válida!");

  if (code.substr(0, 1) == "8") {
    if (code.substr(1, 1) == "1") {
      return "ARRECADACAO_PREFEITURA";
    } else if (code.substr(1, 1) == "2") {
      return "CONVENIO_SANEAMENTO";
    } else if (code.substr(1, 1) == "3") {
      return "CONVENIO_ENERGIA_ELETRICA_E_GAS";
    } else if (code.substr(1, 1) == "4") {
      return "CONVENIO_TELECOMUNICACOES";
    } else if (code.substr(1, 1) == "5") {
      return "ARRECADACAO_ORGAOS_GOVERNAMENTAIS";
    } else if (code.substr(1, 1) == "6" || code.substr(1, 1) == "9") {
      return "OUTROS";
    } else if (code.substr(1, 1) == "7") {
      return "ARRECADACAO_TAXAS_DE_TRANSITO";
    }
  } else {
    return "BANCO";
  }
}

// Identificar o código de referência para qual módulo
// Usar para calcular os dígitos verificadores

export function identifyReference(code: any) {
  code = code.replace(/[^0-9]/g, "");

  const reference = code.substr(2, 1);

  if (typeof code !== "string")
    throw new TypeError("Insira uma string válida!");

  switch (reference) {
    case "6":
      return {
        mod: 10,
        effective: true,
      };
      break;
    case "7":
      return {
        mod: 10,
        effective: false,
      };
      break;
    case "8":
      return {
        mod: 11,
        effective: true,
      };
      break;
    case "9":
      return {
        mod: 11,
        effective: false,
      };
      break;
    default:
      break;
  }
}

//Identificar a data de vencimento do boleto

export function identifyDate(code: any, codeType: any) {
  code = code.replace(/[^0-9]/g, "");

  const ticketType = identifyTypeOfTicket(code);

  let dateFactor = "";
  let ticketDate: Date | null = new Date();

  ticketDate.setFullYear(1997);
  ticketDate.setMonth(9);
  ticketDate.setDate(7);
  ticketDate.setHours(23, 54, 59);

  if (codeType === "CODIGO_DE_BARRAS") {
    if (ticketType == "BANCO") {
      dateFactor = code.substr(5, 4);

      ticketDate.setDate(ticketDate.getDate() + Number(dateFactor));
      ticketDate.setTime(
        ticketDate.getTime() +
          ticketDate.getTimezoneOffset() -
          3 * 60 * 60 * 1000
      );
      var dateTicketForm =
        ticketDate.getDate() +
        "/" +
        (ticketDate.getMonth() + 1) +
        "/" +
        ticketDate.getFullYear();

      return dateTicketForm;
    } else {
      ticketDate = null;
      return ticketDate;
    }
  } else if (codeType === "LINHA_DIGITAVEL") {
    if (ticketType == "BANCO") {
      dateFactor = code.substr(33, 4);

      ticketDate.setDate(ticketDate.getDate() + Number(dateFactor));
      ticketDate.setTime(
        ticketDate.getTime() +
          ticketDate.getTimezoneOffset() -
          3 * 60 * 60 * 1000
      );
      var dateTicketForm =
        ticketDate.getDate() +
        "/" +
        (ticketDate.getMonth() + 1) +
        "/" +
        ticketDate.getFullYear();

      return dateTicketForm;
    } else {
      ticketDate = null;
      return ticketDate;
    }
  }
}

// Identificar o preço do boleto do tipo arrecadação
export function identifyValueBarCodeCollection(code: any, codeType: any) {
  code = code.replace(/[^0-9]/g, "");

  const isEffectiveValue = identifyReference(code)?.effective;

  let ticketValue: string | any = "";
  let finalValue: any;

  if (isEffectiveValue) {
    if (codeType == "LINHA_DIGITAVEL") {
      ticketValue = code.substr(4, 14);
      ticketValue = code.split("");
      finalValue.splice(11, 1);
      ticketValue = ticketValue.join("");
      ticketValue = ticketValue.substr(4, 11);
    } else if (codeType === "CODIGO_DE_BARRAS") {
      ticketValue = code.substr(4, 11);
    }

    finalValue = ticketValue.substr(0, 9) + "." + ticketValue.substr(9, 2);

    let char = finalValue.substr(1, 1);
    while (char === "0") {
      finalValue = substringReplace(finalValue, "", 0, 1);
      char = finalValue.substr(1, 1);
    }
  } else {
    finalValue = 0;
  }

  return finalValue;
}

//  Identificar o preço do boleto
export function identifyValue(code: any, codeType: any) {
  const ticketType = identifyTypeOfTicket(code);

  let ticketValue = "";
  let finalValue: string | any;

  if (codeType == "CODIGO_DE_BARRAS") {
    if (ticketType == "BANCO") {
      ticketValue = code.substr(9, 10);
      finalValue = ticketValue.substr(0, 8) + "." + ticketValue.substr(8, 2);

      let char = finalValue.substr(1, 1);
      while (char === "0") {
        finalValue = substringReplace(finalValue, "", 0, 1);
        char = finalValue.substr(1, 1);
      }
    } else {
      finalValue = identifyValueBarCodeCollection(code, "CODIGO_DE_BARRAS");
    }
  } else if (codeType == "LINHA_DIGITAVEL") {
    if (ticketType == "BANCO") {
      ticketValue = code.substr(37);

      let char: any = finalValue.substr(1, 1);
      while (char === "0") {
        finalValue = substringReplace(finalValue, "", 0, 1);
        char = finalValue.substr(1, 1);
      }
    } else {
      finalValue = identifyValueBarCodeCollection(code, "LINHA_DIGITAVEL");
    }
  }
  return parseFloat(finalValue);
}

// Identificar o módulo para calcular os dígitos verificadores
export function VerifierDigits(code: any, mod: any) {
  code = code.replace(/[^0-9]/g, "");
  switch (mod) {
    case 10:
      return (code + calculateModuleTen(code)).toString();
      break;
    case 11:
      return (code + calculateModuleEleven(code)).toString();
      break;
    default:
      break;
  }
}

// Converter o código de barras em linha digitável
export function typeableLineBarcode(code: any, formated: any) {
  code = code.replace(/[^0-9]/g, "");

  const ticketType = identifyTypeOfTicket(code);

  let result = "";

  if (ticketType == "BANCO") {
    const newLine =
      code.substr(0, 4) +
      code.substr(19, 25) +
      code.substr(4, 1) +
      code.substr(5, 14);

    const blockOne =
      newLine.substr(0, 9) + calculateModuleTen(newLine.substr(0, 9));
    const blockTwo =
      newLine.substr(9, 10) + calculateModuleTen(newLine.substr(9, 10));
    const blockThree =
      newLine.substr(19, 10) + calculateModuleTen(newLine.substr(19, 10));
    const blockFour = newLine.substr(29);

    result = (blockOne + blockTwo + blockThree + blockFour).toString();

    if (formated) {
      result =
        result.slice(0, 5) +
        "." +
        result.slice(5, 10) +
        " " +
        result.slice(10, 15) +
        "." +
        result.slice(15, 21) +
        " " +
        result.slice(21, 26) +
        "." +
        result.slice(26, 32) +
        " " +
        result.slice(32, 33) +
        " " +
        result.slice(33);
    }
  } else {
    const identificationActualValueOrReference = identifyReference(code);
    let blockOne;
    let blockTwo;
    let blockThree;
    let blockFour;

    if (identificationActualValueOrReference?.mod == 10) {
      blockOne = code.substr(0, 11) + calculateModuleTen(code.substr(0, 11));
      blockTwo = code.substr(11, 11) + calculateModuleTen(code.substr(11, 11));
      blockThree =
        code.substr(22, 11) + calculateModuleTen(code.substr(22, 11));
      blockFour = code.substr(33, 11) + calculateModuleTen(code.substr(33, 11));
    } else if (identificationActualValueOrReference?.mod == 11) {
      blockOne = code.substr(0, 11) + calculateModuleEleven(code.substr(0, 11));
      blockTwo =
        code.substr(11, 11) + calculateModuleEleven(code.substr(11, 11));
      blockThree =
        code.substr(22, 11) + calculateModuleEleven(code.substr(22, 11));
      blockFour =
        code.substr(33, 11) + calculateModuleEleven(code.substr(33, 11));
    }

    result = blockOne + blockTwo + blockThree + blockFour;
  }

  return result;
}

//  Converter a linha digitável em códgio de barras
export function ConvertTypedLineToBarcode(code: any) {
  code = code.replace(/[^0-9]/g, "");

  const ticketType = identifyTypeOfTicket(code);

  let result = "";

  if (ticketType == "BANCO") {
    result =
      code.substr(0, 4) +
      code.substr(32, 1) +
      code.substr(33, 14) +
      code.substr(4, 5) +
      code.substr(10, 10) +
      code.substr(21, 10);
  } else {
    code = code.split("");
    code.splice(11, 1);
    code.splice(22, 1);
    code.splice(33, 1);
    code.splice(44, 1);
    code = code.join("");

    result = code;
  }

  return result;
}
//  Calcular o dígito verificador de toda a numeração do código de barras
export function calculateVerifyingDigit(
  code: any,
  codePosition: any,
  mod: any
) {
  code = code.replace(/[^0-9]/g, "");

  code = code.split("");
  code.splice(codePosition, 1);
  code = code.join("");

  if (mod === 10) {
    return calculateModuleTen(code);
  } else if (mod === 11) {
    return calculateModuleEleven(code);
  }
}

// Identificar se o código de barras é válido
export function validateCodeWithVerifyingDigit(code: any, codeType: any) {
  code = code.replace(/[^0-9]/g, "");

  let ticketType;

  let result;

  if (codeType === "LINHA_DIGITAVEL") {
    ticketType = identifyTypeOfTicket(code);

    if (ticketType == "BANCO") {
      const blockOne =
        code.substr(0, 9) + calculateModuleTen(code.substr(0, 9));
      const blockTwo =
        code.substr(10, 10) + calculateModuleTen(code.substr(10, 10));
      const blockThree =
        code.substr(21, 10) + calculateModuleTen(code.substr(21, 10));
      const blockFour = code.substr(32, 1);
      const blockFive = code.substr(33);

      result = (
        blockOne +
        blockTwo +
        blockThree +
        blockFour +
        blockFive
      ).toString();
    } else {
      const valueIdentificationRealOrReference = identifyReference(code);
      let blockOne;
      let blockTwo;
      let blockThree;
      let blockFour;

      if (valueIdentificationRealOrReference?.mod == 10) {
        blockOne = code.substr(0, 11) + calculateModuleTen(code.substr(0, 11));
        blockTwo =
          code.substr(12, 11) + calculateModuleTen(code.substr(12, 11));
        blockThree =
          code.substr(24, 11) + calculateModuleTen(code.substr(24, 11));
        blockFour =
          code.substr(36, 11) + calculateModuleTen(code.substr(36, 11));
      } else if (valueIdentificationRealOrReference?.mod == 11) {
        blockOne = code.substr(0, 11);
        blockTwo = code.substr(12, 11);
        blockThree = code.substr(24, 11);
        blockFour = code.substr(36, 11);

        let vdOne = parseInt(code.substr(11, 1));
        let vdTwo = parseInt(code.substr(23, 1));
        let vdThree = parseInt(code.substr(35, 1));
        let vdFour = parseInt(code.substr(47, 1));

        let valid =
          calculateModuleEleven(blockOne) == vdOne &&
          calculateModuleEleven(blockTwo) == vdTwo &&
          calculateModuleEleven(blockThree) == vdThree &&
          calculateModuleEleven(blockFour) == vdFour;

        return valid;
      }

      result = blockOne + blockTwo + blockThree + blockFour;
    }
  } else if (codeType === "CODIGO_DE_BARRAS") {
    ticketType = identifyTypeOfTicket(code);

    if (ticketType == "BANCO") {
      const VD = calculateVerifyingDigit(code, 4, 11);
      result = code.substr(0, 4) + VD + code.substr(5);
    } else {
      const valueIdentificationRealOrReference = identifyReference(code);

      result = code.split("");
      result.splice(3, 1);
      result = result.join("");

      const VD = calculateVerifyingDigit(
        code,
        3,
        valueIdentificationRealOrReference?.mod
      );
      result = result.substr(0, 3) + VD + result.substr(3);
    }
  }

  return code === result;
}

// ============= Gerar código de barras com calculo do digito verificador =============
// ============= Gerar código de barras com calculo do digito verificador =============

export function generateBarCode(code: any) {
  code = code.replace(/[^0-9]/g, "");

  const ticketType = identifyTypeOfTicket(code);

  let newCode;

  newCode = ConvertTypedLineToBarcode(code);
  newCode = newCode.split("");
  newCode.splice(4, 1);
  newCode = newCode.join("");
  let dv = calculateModuleEleven(newCode);
  newCode = newCode.substr(0, 4) + dv + newCode.substr(4);

  return newCode;
}

// ============= Calcular o digito verificador de numeração a partir do módulo 10 =============
function calculateModuleTen(num: any) {
  num = num.replace(/\D/g, "");
  var i;
  var multiplier = 2;
  var sum = 0;
  var s = "";

  for (i = num.length - 1; i >= 0; i--) {
    s = multiplier * parseInt(num.charAt(i)) + s;
    if (--multiplier < 1) {
      multiplier = 2;
    }
  }
  for (i = 0; i < s.length; i++) {
    sum = sum + parseInt(s.charAt(i));
  }
  sum = sum % 10;
  if (sum != 0) {
    sum = 10 - sum;
  }
  return sum;
}

//  Calcular o digito verificador de numeração a partir do módulo 11
function calculateModuleEleven(x: any) {
  let sequence = [4, 3, 2, 9, 8, 7, 6, 5];
  let digit = 0;
  let j = 0;
  let DAC = 0;

  for (var i = 0; i < x.length; i++) {
    let multiplier = sequence[j];
    j++;
    j %= sequence.length;
    digit += multiplier * parseInt(x.charAt(i));
  }

  DAC = 11 - (digit % 11);

  if (DAC == 0 || DAC == 1 || DAC == 10 || DAC == 11) return 1;
  else return DAC;
}

// ============= Função auxiliar para remover os zeros no código inserido=============
function substringReplace(
  str: string,
  repl: string,
  start: any,
  size: number | any
) {
  if (start < 0) {
    start = start + str.length;
  }

  size = size !== undefined ? size : str.length;
  if (size < 0) {
    size = size + str.length - start;
  }

  return [
    str.slice(0, start),
    repl.substr(0, size),
    repl.slice(size),
    str.slice(start + size),
  ].join("");
}
