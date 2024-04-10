// const axios = require('axios')
// const fs = require('fs')
import axios from 'axios'
import * as fs from 'fs'
import * as path from 'path'


export function getUrls(clientId) {
    return {
        base: 'https://api.tillhub.com/api/',
        transactionsRoute: `v1/transactions/${clientId}/legacy`,
        documentsRoute: `v0/documents/${clientId}?documentTypeGroup=Direct`,
        downloadRoute: `v0/documents/${clientId}/[:documentId]/download`
    }
}

export async function getTransactionDate(txId, {clientId, token}, registerId, balanceNumber) {
    // Get transaction
    // console.log("Getting transaction...")
    const urls = getUrls(clientId)
    let url = urls.base + urls.transactionsRoute
    let argConnector = "?"

    if (registerId) {
        url += `${argConnector}register=${registerId}`
        // console.info(`Only searching the transactions for register ${registerId}`)
        argConnector = "&"
    }

    if (balanceNumber) {
        url += `${argConnector}balance_number=${balanceNumber}`
        // console.info(`Only searching the transactions for balance number ${balanceNumber}`)
    }

    let config = {
        method: 'get',
        url,
        headers: {
            'Authorization': `Bearer ${token}`
        },
        data: ''
    };

    try {
        const response = await axios.request(config)
        for (const tx of response.data.results) {
            if (tx.transaction_number == txId) {
                // console.log(`Found transaction with id ${tx.transaction_number} from ${tx.date}`)
                return tx.date
            }
        }
    } catch (error) {
        console.error(error)
    }
    throw new Error("Transaction date not found.")
}

export async function getDocument(txDate, {clientId, token}) {
    // console.log("Searching for matching invoice...")
    const urls = getUrls(clientId)
    const url = urls.base + urls.documentsRoute
    let config = {
        method: 'get',
        url,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };

    try {
        const response = await axios.request(config)
        for (const document of response.data.results) {
            if (document.documentType == 'Invoice' && document.createdAt == txDate) {
                // console.info(`Found matching invoice, id is ${document.id}`)
                // console.log(document)
                return document
            }
        }
    } catch (error) {
        console.error(error)
    }
    throw new Error("Could not find invoice.")
}

export async function getDocumentData(documentId, {clientId, token}) {
    // console.log("Getting document data...")
    const urls = getUrls(clientId)
    const url = (urls.base + urls.downloadRoute).replace('[:documentId]', documentId)

    let config = {
        method: 'get',
        url,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };

    try {
        const response = await axios.request(config)
        return response.data.results[0]
    } catch (error) {
        console.error(error)
    }
    throw new Error("Could not find invoice.")
}

export function createPDF(document) {
    // console.log(`Creating PDF file at ${document.fileName}...`)
    // Decoding the base64 content
    // console.log(`Decoding content...`)
    const pdfContent = Buffer.from(document.base64Content, 'base64');

    // Writing the content to a file
    // console.log(`Writing to ${document.fileName}`)
    const filePath = path.join(process.cwd(), document.fileName)
    fs.writeFileSync(filePath, pdfContent, { encoding: 'binary' }, (err) => {
        if (err) throw err;
    });
    // console.log(`PDF file has been saved to ${document.fileName}.`);
    return filePath
}

export async function getInvoiceByTimestamp(txId, {clientId, token}, regId = null, balanceNo = null) {
    try {
        // console.info("Trying to retrieve invoice...")
        const date = await getTransactionDate(txId, {clientId, token}, regId, balanceNo)
        const document = await getDocument(date, {clientId, token})
        const documentData = await getDocumentData(document.id, {clientId, token})
        const documentLink = createPDF(documentData)
        return documentLink
    } catch(error) {
        throw new Error("Could not download invoice.", error)
        // console.error("Could not download invoice.", error)
    }

}