import Papa from 'papaparse';
import mammoth from 'mammoth';

export type SpecImportResult = {
  specs: Record<string, string>;
  specDetails?: Array<{
    property: string;
    value: string;
    testMethod?: string;
    unit?: string;
  }>;
  extractedTitle?: string;
  extractedDescription?: string;
  rawText?: string;
};

/**
 * Clean string keys and values
 */
function cleanText(txt: string): string {
  return txt.replace(/\s+/g, ' ').trim();
}

/**
 * Parse CSV / TSV text containing specifications
 */
export function parseCsvSpecs(csvText: string): SpecImportResult {
  const parsed = Papa.parse<string[]>(csvText, {
    skipEmptyLines: true,
  });

  const rows = parsed.data;
  if (!rows || rows.length === 0) {
    throw new Error('CSV file is empty or could not be parsed');
  }

  const specs: Record<string, string> = {};
  const specDetails: NonNullable<SpecImportResult['specDetails']> = [];

  // Detect header if first row looks like columns
  const firstRow = rows[0].map((c) => c.toLowerCase().trim());
  const hasHeader =
    firstRow.some(
      (c) =>
        c.includes('param') ||
        c.includes('prop') ||
        c.includes('item') ||
        c.includes('spec') ||
        c.includes('element')
    ) &&
    firstRow.some(
      (c) =>
        c.includes('val') ||
        c.includes('typical') ||
        c.includes('guarantee') ||
        c.includes('result') ||
        c.includes('content') ||
        c.includes('assay')
    );

  const startIndex = hasHeader ? 1 : 0;

  for (let i = startIndex; i < rows.length; i++) {
    const row = rows[i];
    if (row.length < 2) continue;

    const paramName = cleanText(row[0]);
    if (!paramName) continue;

    let val = cleanText(row[1]);
    let method = '';
    let unit = '';

    if (row.length >= 3 && cleanText(row[2])) {
      const col2 = cleanText(row[2]);
      if (
        col2.toLowerCase().includes('astm') ||
        col2.toLowerCase().includes('iso') ||
        col2.toLowerCase().includes('bs') ||
        col2.toLowerCase().includes('din')
      ) {
        method = col2;
      } else if (
        ['%', 'mm', 'g/cm3', 'mpa', 'ppm', 'kcal/kg', 't/m3', 'mt'].includes(col2.toLowerCase())
      ) {
        unit = col2;
      } else {
        val = `${val} (Typical: ${col2})`;
      }
    }

    if (row.length >= 4 && cleanText(row[3])) {
      const col3 = cleanText(row[3]);
      if (
        !method &&
        (col3.toLowerCase().includes('astm') ||
          col3.toLowerCase().includes('iso') ||
          col3.toLowerCase().includes('bs'))
      ) {
        method = col3;
      }
    }

    specs[paramName] = val;
    specDetails.push({
      property: paramName,
      value: val,
      unit: unit || undefined,
      testMethod: method || undefined,
    });
  }

  return {
    specs,
    specDetails,
    rawText: csvText,
  };
}

/**
 * Parse Word Document (.docx) specifications
 */
export async function parseDocxSpecs(arrayBuffer: ArrayBuffer): Promise<SpecImportResult> {
  const result = await mammoth.convertToHtml({ arrayBuffer });
  const rawTextResult = await mammoth.extractRawText({ arrayBuffer });
  const html = result.value;
  const rawText = rawTextResult.value;

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const specs: Record<string, string> = {};
  const specDetails: NonNullable<SpecImportResult['specDetails']> = [];

  // 1. Look for HTML tables inside the Word doc
  const tables = doc.querySelectorAll('table');
  if (tables.length > 0) {
    tables.forEach((table) => {
      const tableRows = table.querySelectorAll('tr');
      tableRows.forEach((tr, index) => {
        const cells = Array.from(tr.querySelectorAll('td, th')).map((td) => cleanText(td.textContent || ''));
        if (cells.length >= 2) {
          if (
            index === 0 &&
            (cells[0].toLowerCase().includes('property') ||
              cells[0].toLowerCase().includes('parameter') ||
              cells[0].toLowerCase().includes('element'))
          ) {
            return;
          }

          const prop = cells[0];
          let val = cells[1];
          let method = '';
          const unit = '';

          if (cells.length >= 3 && cells[2]) {
            const extra = cells[2];
            if (
              extra.toLowerCase().includes('astm') ||
              extra.toLowerCase().includes('iso') ||
              extra.toLowerCase().includes('bs') ||
              extra.toLowerCase().includes('din')
            ) {
              method = extra;
            } else {
              val = `${val} / ${extra}`;
            }
          }

          if (cells.length >= 4 && cells[3]) {
            method = cells[3];
          }

          if (prop && val) {
            specs[prop] = val;
            specDetails.push({
              property: prop,
              value: val,
              testMethod: method || undefined,
              unit: unit || undefined,
            });
          }
        }
      });
    });
  }

  // 2. If no tables or few table rows, parse colon-separated key-values from raw text paragraphs
  if (Object.keys(specs).length < 2) {
    const lines = rawText.split(/\r\n|\r|\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      if (trimmed.includes(':') || trimmed.includes(' - ') || trimmed.includes('\t')) {
        let separator = ':';
        if (!trimmed.includes(':') && trimmed.includes('\t')) separator = '\t';
        else if (!trimmed.includes(':') && trimmed.includes(' - ')) separator = ' - ';

        const splitIdx = trimmed.indexOf(separator);
        const key = cleanText(trimmed.substring(0, splitIdx));
        const value = cleanText(trimmed.substring(splitIdx + separator.length));

        if (key && value && key.length < 50 && value.length < 150) {
          specs[key] = value;
          specDetails.push({
            property: key,
            value: value,
          });
        }
      }
    }
  }

  // Extract possible title from first heading or line
  const firstHeading = doc.querySelector('h1, h2, h3, p strong')?.textContent?.trim();
  const extractedTitle = firstHeading && firstHeading.length < 80 ? cleanText(firstHeading) : undefined;

  return {
    specs,
    specDetails,
    extractedTitle,
    rawText,
  };
}

/**
 * Universal file importer dispatcher
 */
export async function parseSpecSheetFile(file: File): Promise<SpecImportResult> {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';

  // Extract a clean title from the filename as fallback
  const rawBaseName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]+/g, ' ').trim();
  const cleanedTitle = rawBaseName
    .replace(/\b(spec|specs|specification|sheet|test|report|analysis|coa|tds|docx|csv)\b/gi, '')
    .trim();
  const fallbackTitle = cleanedTitle.length > 2 ? cleanedTitle : rawBaseName;

  if (extension === 'csv' || extension === 'tsv' || extension === 'txt') {
    const text = await file.text();
    const result = parseCsvSpecs(text);
    if (!result.extractedTitle) {
      result.extractedTitle = fallbackTitle;
    }
    return result;
  }

  if (extension === 'docx') {
    const arrayBuffer = await file.arrayBuffer();
    const result = await parseDocxSpecs(arrayBuffer);
    if (!result.extractedTitle) {
      result.extractedTitle = fallbackTitle;
    }
    return result;
  }

  if (extension === 'doc') {
    throw new Error('Please save legacy .doc files as Word document (.docx) or .csv format before importing.');
  }

  throw new Error(`Unsupported file type (.${extension}). Please upload a .docx Word document or a .csv spreadsheet.`);
}
