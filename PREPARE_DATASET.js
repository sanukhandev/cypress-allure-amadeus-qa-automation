const XLSX = require('xlsx');
const workbook = XLSX.readFile('./data/TestCase.xlsx');
const fs = require('fs');
const SHEET_NAMES = ['Flight', 'Hotel'];



const convertExcelDateSerial = (serial) => {
    const originDate = new Date(Date.UTC(1900, 0, 1)); // Excel date starts from "1900-01-01"
    const targetDate = new Date(originDate.getTime() + (serial - (serial > 59 ? 2 : 1)) * 24 * 60 * 60 * 1000);

    const dd = String(targetDate.getUTCDate()).padStart(2, '0');
    const mmm = targetDate.toLocaleString('en-US', { month: 'short' }); // Get month in short format (e.g., "Oct")
    const yyyy = targetDate.getUTCFullYear();

    return `${dd}-${mmm}-${yyyy}`;
}


// convert excel row to payload
SHEET_NAMES.forEach((SHEET_NAME) => {
   let file_details = XLSX.utils.sheet_to_json(workbook.Sheets[SHEET_NAME]);
//  write to json file

    fs.writeFile(`cypress/fixtures/${SHEET_NAME}.json`, JSON.stringify(file_details,null,2), function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
});



// get google sheet data

// const {getAuthToken, getSpreadSheet, getSpreadSheetValues} = require('./googleservice');
//
// const spreadsheetId = '1gn-CLzt63RwRsvEmwMQQ9wVQbflnwOnplMY23YTkBa8';
// const sheetName = 'Flight';
// const sheetName1 = 'Hotel';
// const sheetName2 = 'Car';
// const sheetName3 = 'Cruise';
//
// (async () => {
//         getSpreadSheetValues({
//             spreadsheetId,
//             auth: await getAuthToken(),
//             sheetName
//         }).then((res) => {
//             console.log(res.data.values);
//
//         })
// })();

