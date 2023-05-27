const fs = require('fs');
const path = require('path');
const EmlParser = require('eml-parser');

const moment = require('moment');

const emlFolderPath = 'elms';
const outputFolderPath = './pdfs';

// Read .eml files from the folder
async function ExtractPDFFromEmlFile(pathToEmlFile) {
    const parsedEml = await new EmlParser(fs.createReadStream(pathToEmlFile))
        .parseEml();

    if (parsedEml.attachments == null) {
        console.error(`${parsedEml}: missing attachment`);
        return;
    }

    const attachments = parsedEml.attachments;

    const pdf = attachments.find(a => a.contentType == 'application/pdf');
    if (!pdf) {
        console.error(`${parsedEml}: missing PDFs`);
        return;
    }

    const pdfFileName = moment(parsedEml.date).format('YYYY-MM-DD') + '.pdf';
    const pdfFilePath = path.join(outputFolderPath, pdfFileName);

    await fs.writeFileSync(pdfFilePath, pdf.content);
}

async function ExtractPdfFromEmlFiles() {
    const files = await fs.readdirSync(emlFolderPath)

    for (const file of files) {
        await ExtractPDFFromEmlFile(`${emlFolderPath}\\${file}`)
    }
}

ExtractPdfFromEmlFiles();