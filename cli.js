import yargs from 'yargs'
import { getInvoiceByTimestamp } from './invoice-getter.js'

const argv = yargs(process.argv.slice(2))
    .option("transactionNumber", {
        describe: 'Number of transaction',
        type: 'number',
    })
    .option("registerId", {
        describe: 'ID of register',
        type: 'string',
        default: null
    })
    .option("balanceNumber", {
        describe: 'Number of balance',
        type: 'number',
        default: null
    })
    .option("clientId", {
        describe: 'UUID of customer',
        type: 'string',
        default: null
    })
    .option("token", {
        describe: 'Bearer token for authentication',
        type: 'string',
        default: null
    })
    .help()
    .alias('help', 'h')
    .strict().argv

const txId = argv['transactionNumber']
const registerId = argv['registerId'] ?? null
const balanceNumber = argv['balanceNumber'] ?? null
const clientId = argv['clientId']
const token = argv['token']

if (!(txId && clientId && token)) {
    throw new Error("Invalid arguments. Call --help for more information")
}


console.log(await getInvoiceByTimestamp(txId, {clientId, token}, registerId, balanceNumber))