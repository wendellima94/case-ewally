export function clean(code: string) {
  return code.replace(/( |\.|-)/g, "");
}

export function moduleTen(block: any) {
  // let Trunc = (x: any) => {
  //   return x < 0 ? Math.ceil(x) : Math.floor(x);
  // };
  const code: any = block.split("").reverse();
  const summation: any = code.reduce(
    (acc: any, current: number, index: any) => {
      let sum = Number(current as any) * (((index + 1) % 2) + 1);
      sum = sum > 9 ? Math.trunc(sum / 10) + (sum % 10) : sum;

      return acc + sum;
    },
    0
  );

  return Math.ceil(summation / 10) * 10 - summation;
}

//módulo 11 do banco
export function moduleElevenBanking(block: any) {
  const code = block.split("").reverse();
  let multiplier = 2;

  const summation: number = code.reduce((acc: any, current: any) => {
    const sum = Number(current) * multiplier;
    multiplier = multiplier === 9 ? 2 : multiplier + 1;

    return acc + sum;
  }, 0);

  const restOfDivision = summation % 11;
  const VerifyingDigit = 11 - restOfDivision;

  if (VerifyingDigit === 0 || VerifyingDigit === 10 || VerifyingDigit === 11)
    return 1;

  return VerifyingDigit;
}

//módulo 11 Arrecadação
export function moduleElevenFundraiser(block: any) {
  const code = block.split("").reverse();
  let multiplier = 2;

  const summation = code.reduce((acc: any, current: any) => {
    const sum = Number(current) * multiplier;
    multiplier = multiplier === 9 ? 2 : multiplier + 1;

    return acc + sum;
  }, 0);
  const restOfDivision = summation % 11;

  if (restOfDivision === 0 || restOfDivision === 1) {
    return 0;
  }

  if (restOfDivision === 10) {
    return 1;
  }

  const VerifyingDigit = 11 - restOfDivision;
  return VerifyingDigit;
}

//conversor de boleto em código de barras
export function convertCollectionIntoBarcode(code: any) {
  const cleanCode = clean(code);
  let barCode = "";

  for (let i = 0; i < 4; i++) {
    const start = 11 * i + i;
    const end = 11 * (i + 1) + i;

    barCode += cleanCode.substring(start, end);
  }
  return barCode;
}

export function convertBankSlipIntoBarCode(code: any) {
  const cleanCode = clean(code);

  let barCode = "";

  barCode += cleanCode.substring(0, 3); // Identificação do banco
  barCode += cleanCode.substring(3, 4); // Código da moeda
  barCode += cleanCode.substring(32, 33); // Dígito verificador
  barCode += cleanCode.substring(33, 37); //Fator vencimento
  barCode += cleanCode.substring(37, 47); //Valor nominal
  barCode += cleanCode.substring(4, 9); //Campo livre bloco 1
  barCode += cleanCode.substring(10, 20); //Campo livre bloco 2
  barCode += cleanCode.substring(21, 31); //Campo livre bloco 3

  return barCode;
}

//validações com Regex
export function bankingBillBarCode(code: any) {
  const cleanCode = clean(code);

  if (!/^[0-9]{44}$/.test(cleanCode)) return false;
  const VerifyingDigit = cleanCode[4];
  const block = cleanCode.substring(0, 4) + cleanCode.substring(5);

  return moduleElevenBanking(block) === Number(VerifyingDigit);
}

export function typeableLineOfTheBill(code: any, validateBlocks = false) {
  const cleanCode = clean(code);

  if (!/^[0-9]{47}$/.test(cleanCode)) return false;
  const blocks = [
    {
      num: cleanCode.substring(0, 9),
      VerifyingDigit: cleanCode.substring(9, 10),
    },
    {
      num: cleanCode.substring(10, 20),
      VerifyingDigit: cleanCode.substring(20, 21),
    },
    {
      num: cleanCode.substring(21, 31),
      VerifyingDigit: cleanCode.substring(31, 32),
    },
  ];

  const validateBlock = validateBlocks
    ? blocks.every((e) => moduleTen(e.num) === Number(e.VerifyingDigit))
    : true;
  const validateVerifyingDigit = bankingBillBarCode(
    convertBankSlipIntoBarCode(cleanCode)
  );
  return validateBlock && validateVerifyingDigit;
}

export function BankSlip(code: any, validateBlocks = false) {
  const cleanCode = clean(code);

  if (cleanCode.length === 44) return bankingBillBarCode(cleanCode);
  if (cleanCode.length === 47)
    return typeableLineOfTheBill(code, validateBlocks);

  return false;
}

export function BarCodeCollectionBill(code: any) {
  const cleanCode = clean(code);

  if (!/^[0-9]{44}$/.test(cleanCode) || Number(cleanCode[0]) !== 8)
    return false;
  const currencyCode = Number(cleanCode[2]);
  const VerifyingDigit = Number(cleanCode[3]);
  const block = cleanCode.substring(0, 3) + cleanCode.substring(4);

  let module;
  if (currencyCode === 6 || currencyCode === 7) module = moduleTen;
  else if (currencyCode === 8 || currencyCode === 9)
    module = moduleElevenFundraiser;
  else return false;

  return module(block) === VerifyingDigit;
}

export function bankPaymentSlipTypeableLine(code: any, validateBlocks = false) {
  const cleanCode = clean(code);

  if (!/^[0-9]{48}$/.test(cleanCode) || Number(cleanCode[0]) !== 8)
    return false;

  const validateVerifyingDigit = BarCodeCollectionBill(
    convertCollectionIntoBarcode(cleanCode)
  );
  if (!validateBlocks) return validateVerifyingDigit;

  const currencyCode = Number(cleanCode[2]);
  let module: any;
  if (currencyCode === 6 || currencyCode === 7) module = moduleTen;
  else if (currencyCode === 8 || currencyCode === 9)
    module = moduleElevenFundraiser;
  else return false;

  const blocks = Array.from(
    {
      length: 4,
    },
    (v: any, i: number) => {
      const start = 11 * i + i;
      const end = 11 + (i + 1) + i;

      return {
        num: cleanCode.substring(start, end),
        VerifyingDigit: cleanCode.substring(end, end + 1),
      };
    }
  );

  const validateBlock = blocks.every(
    (e) => module(e.num) === Number(e.VerifyingDigit)
  );
  return validateBlock && validateVerifyingDigit;
}

export function billetCollection(code: any, validateBlocks = false) {
  const cleanCode = clean(code);

  if (cleanCode.length === 44) return BarCodeCollectionBill(cleanCode);
  if (cleanCode.length === 48)
    return bankPaymentSlipTypeableLine(code, validateBlocks);

  return false;
}
