# case-ewally
O objetivo deste programa é validar a linha digitável de dois tipos de boleto e retornar algumas informações sobre o mesmo.

## Tecnologias utilizadas 
TypeScript / Node.js / Express.js / TS-NODE-DEV

## Endpoints
Validar linha digitável do boleto
http://localhost:4000/boleto

## Dentro do arquivo 
### ticketController.ts temos alguns exemplos de boletos para testes! 

## Forma de utilizar
  1 - Instale as depencias com o comando #yarn install
  
  2 - dentro da pasta src utilize o comando #yarn dev
  
## Responses:
Status 200 OK Exemplo : 

## Caso retorne TRUE
{

  sucess: true,
  
  inputCode: '83860000005096000190000008017823000034306271',
  
  message: 'Boleto válido',
  
  typeInputCode: 'CODIGO_DE_BARRAS',
  
  ticketType: 'CONVENIO_ENERGIA_ELETRICA_E_GAS',
  
  codeBar: '83860000005096000190000008017823000034306271',
  
  digitableLine: '838600000051096000190009000801782309000343062712',
  
  dueDate: null,
  
  value: 509.6
  
}

# Caso retorne FALSE
{

  sucess: false,
  
  inputCode: '858200000007572503282030560708202107539591904460',
  
  message: 'A validação do dígito verificador falhou. Tem certeza que inseriu a numeração correta?',
  
  typeInputCode: '',
  
  ticketType: '',
  
  codeBar: '',
  
  digitableLine: '',
  
  dueDate: '',
  
  value: 0
  
}

## Obs: A data de vencimento pode ser nula.

400 BAD REQUEST
{

"message": "O código inserido possui 0 dígitos. Por favor insira uma numeração válida."

### PS: O ERRO PODE ALTERAR DE ACORDO COM O MODELO DOS DIGITOS  

}
