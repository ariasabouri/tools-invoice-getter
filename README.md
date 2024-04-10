# Invoice Retrieval and PDF Generation Library

This library provides functionalities to interact with the Tillhub API to retrieve transaction data and generate invoices as PDF documents. It is built using modern JavaScript features, including ES Modules, async/await for asynchronous operations, and Axios for HTTP requests.

## Features

- Retrieve transaction data by transaction ID.
- Search for invoices by transaction date.
- Download invoice data and generate PDF documents.

## Installation

To use this library in your project, first clone this repository or download the source code. Then, install the dependencies:

```bash
npm install
```

This library requires Node.js (version 12 or later) and npm to be installed on your machine.

## Usage

Here is an example of how to use this library to retrieve an invoice by its timestamp and generate a PDF:

```javascript
import { getInvoiceByTimestamp } from './path/to/library';

const transactionId = 'your-transaction-id';
const clientId = 'your-client-id';
const token = 'your-authentication-token';
const registerId = 'optional-register-id';
const balanceNumber = 'optional-balance-number';

getInvoiceByTimestamp(transactionId, { clientId, token }, registerId, balanceNumber)
  .then((documentLink) => {
    console.log(`PDF generated: ${documentLink}`);
  })
  .catch((error) => {
    console.error(error);
  });
```

Replace 'path/to/library' with the actual path where the library files are located.

## API Configuration
This library is configured to work with the Tillhub API. Ensure you have the correct API base URL, and your client ID and tokens are set up correctly.