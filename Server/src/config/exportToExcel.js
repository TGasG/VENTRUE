const xlsx = require('xlsx');

const exportExcel = async (
    data,
    workSheetColumnNames,
    workSheetName,
    fileName,
    response
) => {
    const workBook = xlsx.utils.book_new();
    const workSheetData = [workSheetColumnNames, ...data];
    const workSheet = xlsx.utils.aoa_to_sheet(workSheetData);
    xlsx.utils.book_append_sheet(workBook, workSheet, workSheetName);

    response.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    response.setHeader(
        'Content-Disposition',
        'attachment; filename=' + fileName
    );

    const wbBuffer = xlsx.write(workBook, {
        type: 'base64',
    });

    return response.end(Buffer.from(wbBuffer, 'base64'));
};

const exportRegistrationInfoToExcel = async (
    registrationInfo,
    workSheetColumnNames,
    workSheetName,
    fileName,
    response
) => {
    const data = registrationInfo.map((info) => [
        info.student.nim,
        info.student.user.name,
        info.student.faculty.name,
        info.student.user.email,
        info.student.user.phone || '',
        info.student.line || '',
        info.student.instagram || '',
        info.student.whatsapp || '',
        info.registerAt,
    ]);
    await exportExcel(
        data,
        workSheetColumnNames,
        workSheetName,
        fileName,
        response
    );
};

module.exports = exportRegistrationInfoToExcel;
