import ExcelJS from "exceljs";

export default class ExcelHelper {
    /**
     * 
     * @param fileName
     * @param data 
     * @param columns
     */
    static async generateAndDownloadExcel(
        fileName: string,
        data: Record<string, any>[],
        columns: { header: string; key: string; width?: number }[]
    ) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Sheet1");

        worksheet.columns = columns;
        data.forEach((row) => worksheet.addRow(row));

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
    }

    /**
     * @param file
     * @returns
     */
    static async parseExcelFile(file: File): Promise<Record<string, any>[]> {
        const workbook = new ExcelJS.Workbook();
        const buffer = await file.arrayBuffer();
        await workbook.xlsx.load(buffer);

        const worksheet = workbook.worksheets[0];
        const rows: Record<string, any>[] = [];

        worksheet.eachRow((row, rowIndex) => {
            if (rowIndex === 1) return; 
            const rowData: Record<string, any> = {};
            row.eachCell((cell, colIndex) => {
                const header = worksheet.getRow(1).getCell(colIndex).value?.toString();
                if (header) rowData[header] = cell.value;
            });
            rows.push(rowData);
        });

        return rows;
    }
}
