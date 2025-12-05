import * as pdfjsLib from 'pdfjs-dist';
import * as XLSX from 'xlsx';
import mammoth from 'mammoth';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export async function extractTextFromFile(file: File): Promise<string> {
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'pdf':
      return extractTextFromPDF(file);
    case 'xlsx':
    case 'xls':
      return extractTextFromExcel(file);
    case 'docx':
    case 'doc':
      return extractTextFromWord(file);
    case 'csv':
    case 'txt':
    case 'json':
      return file.text();
    default:
      throw new Error(`Formato non supportato: .${extension}`);
  }
}

async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let text = '';
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item: any) => item.str)
      .join(' ');
    text += pageText + '\n';
  }
  
  return text;
}

async function extractTextFromExcel(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  let text = '';
  
  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];
    for (const row of data) {
      text += row.join(' ') + '\n';
    }
  }
  
  return text;
}

async function extractTextFromWord(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

export const SUPPORTED_EXTENSIONS = ['.pdf', '.xlsx', '.xls', '.docx', '.doc', '.csv', '.txt', '.json'];

