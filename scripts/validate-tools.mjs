import Papa from 'papaparse';

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertDeepEqual(actual, expected, message) {
  const actualJson = JSON.stringify(actual);
  const expectedJson = JSON.stringify(expected);
  if (actualJson !== expectedJson) {
    throw new Error(`${message}\nExpected: ${expectedJson}\nActual: ${actualJson}`);
  }
}

function parseDelimitedRows(text, delimiter) {
  const result = Papa.parse(text, {
    delimiter,
    skipEmptyLines: 'greedy',
  });

  if (result.errors.length > 0) {
    throw new Error(result.errors[0].message);
  }

  return result.data.map((row) => row.map((cell) => cell ?? ''));
}

function parseDelimitedObjects(text, delimiter) {
  const rows = parseDelimitedRows(text, delimiter);
  if (rows.length === 0) {
    return { columns: [], data: [] };
  }

  const maxColumnCount = rows.reduce((max, row) => Math.max(max, row.length), 0);
  const paddedRows = rows.map((row) =>
    Array.from({ length: maxColumnCount }, (_, index) => row[index] ?? '')
  );
  const headerRow = paddedRows[0];
  const seenNames = new Map();
  const keptColumns = Array.from({ length: maxColumnCount }, (_, index) => {
    const rawHeader = headerRow[index] ?? '';
    const trimmedHeader = rawHeader.trim();
    const columnHasData = paddedRows.slice(1).some((row) => String(row[index] ?? '').trim() !== '');

    if (!trimmedHeader && !columnHasData) {
      return null;
    }

    const baseName = trimmedHeader || `column_${index + 1}`;
    const existingCount = seenNames.get(baseName) ?? 0;
    seenNames.set(baseName, existingCount + 1);

    return {
      index,
      name: existingCount === 0 ? baseName : `${baseName}_${existingCount + 1}`,
    };
  }).filter(Boolean);

  const columns = keptColumns.map((column) => column.name);
  const data = paddedRows.slice(1).map((row) => {
    const normalized = {};
    keptColumns.forEach((column) => {
      normalized[column.name] = row[column.index] ?? '';
    });
    return normalized;
  });

  return { columns, data };
}

function stringifyDelimitedRows(rows, delimiter) {
  return Papa.unparse(rows, {
    delimiter,
    newline: '\n',
  });
}

function flattenXmlElement(element, prefix = '') {
  const flattened = {};
  const keyPrefix = prefix ? `${prefix}.` : '';

  Array.from(element.attributes || []).forEach((attribute) => {
    flattened[`${keyPrefix}@${attribute.name}`] = attribute.value;
  });

  const children = Array.from(element.children || []);
  if (children.length === 0) {
    const textContent = Array.from(element.childNodes || [])
      .filter((node) => node.nodeType === 3)
      .map((node) => node.textContent || '')
      .join('')
      .trim();

    if (prefix) {
      flattened[prefix] = textContent;
    } else if (textContent) {
      flattened[element.tagName] = textContent;
    }
    return flattened;
  }

  const grouped = new Map();
  children.forEach((child) => {
    const group = grouped.get(child.tagName) || [];
    group.push(child);
    grouped.set(child.tagName, group);
  });

  grouped.forEach((group, tagName) => {
    const childKey = prefix ? `${prefix}.${tagName}` : tagName;
    const allLeafNodes = group.every((child) => child.children.length === 0 && child.attributes.length === 0);

    if (group.length > 1 && allLeafNodes) {
      flattened[childKey] = group
        .map((child) => (child.textContent || '').trim())
        .filter((value) => value !== '')
        .join('; ');
      return;
    }

    if (group.length > 1) {
      group.forEach((child, index) => {
        Object.assign(flattened, flattenXmlElement(child, `${childKey}_${index + 1}`));
      });
      return;
    }

    Object.assign(flattened, flattenXmlElement(group[0], childKey));
  });

  return flattened;
}

function scoreXmlRecordGroup(group) {
  if (group.length === 0) return -1;
  const flattenedSamples = group.slice(0, 5).map((element) => flattenXmlElement(element));
  const averageFieldCount =
    flattenedSamples.reduce((sum, record) => sum + Object.keys(record).length, 0) / flattenedSamples.length;
  const childCountAverage =
    group.reduce((sum, element) => sum + element.children.length, 0) / group.length;
  return averageFieldCount * 100 + childCountAverage * 10 + group.length;
}

function selectXmlRecordElements(xmlText) {
  const parser = new DOMParser();
  const xmlDocument = parser.parseFromString(xmlText, 'application/xml');
  let bestGroup = [];
  let bestScore = -1;

  const visit = (element) => {
    const children = Array.from(element.children || []);
    if (children.length > 1) {
      const grouped = new Map();
      children.forEach((child) => {
        const group = grouped.get(child.tagName) || [];
        group.push(child);
        grouped.set(child.tagName, group);
      });

      grouped.forEach((group) => {
        const score = scoreXmlRecordGroup(group);
        if (score > bestScore) {
          bestScore = score;
          bestGroup = group;
        }
      });
    }

    children.forEach(visit);
  };

  visit(xmlDocument.documentElement);
  return bestGroup;
}

function splitByColumn(rows, columnName) {
  const headerRow = rows[0];
  const dataRows = rows.slice(1);
  const columnIndex = headerRow.indexOf(columnName);
  assert(columnIndex !== -1, `Column ${columnName} not found`);

  const groups = {};
  dataRows.forEach((row) => {
    const value = row[columnIndex] || 'Empty';
    if (!groups[value]) {
      groups[value] = [headerRow];
    }
    groups[value].push(row);
  });
  return groups;
}

function splitByRows(rows, splitCount) {
  const headerRow = rows[0];
  const dataRows = rows.slice(1);
  const rowsPerFile = Math.ceil(dataRows.length / splitCount);
  const groups = {};

  for (let i = 0; i < splitCount; i += 1) {
    const startIndex = i * rowsPerFile;
    const endIndex = Math.min(startIndex + rowsPerFile, dataRows.length);
    if (startIndex < dataRows.length) {
      groups[`part_${i + 1}`] = [headerRow, ...dataRows.slice(startIndex, endIndex)];
    }
  }

  return groups;
}

function runValidation() {
  const csvSample = [
    'name,department,notes',
    '"Alice, A.",Sales,"Line 1',
    'Line 2"',
    '"Bob ""The Builder""",Engineering,"Uses ""quotes"""',
  ].join('\n');

  const parsedRows = parseDelimitedRows(csvSample, ',');
  assertDeepEqual(
    parsedRows,
    [
      ['name', 'department', 'notes'],
      ['Alice, A.', 'Sales', 'Line 1\nLine 2'],
      ['Bob "The Builder"', 'Engineering', 'Uses "quotes"'],
    ],
    'CSV row parsing should preserve commas, quotes, and newlines'
  );

  const parsedObjects = parseDelimitedObjects(csvSample, ',');
  assertDeepEqual(
    parsedObjects,
    {
      columns: ['name', 'department', 'notes'],
      data: [
        { name: 'Alice, A.', department: 'Sales', notes: 'Line 1\nLine 2' },
        { name: 'Bob "The Builder"', department: 'Engineering', notes: 'Uses "quotes"' },
      ],
    },
    'CSV object parsing should preserve structured values'
  );

  const csvRoundTrip = stringifyDelimitedRows(parsedRows, ',');
  assertDeepEqual(
    parseDelimitedRows(csvRoundTrip, ','),
    parsedRows,
    'CSV stringify should round-trip parsed rows'
  );

  const csvWithBlankHeaders = [
    'english,example,chinese,,,',
    'hello,example,你好,,,',
  ].join('\n');
  assertDeepEqual(
    parseDelimitedRows(csvWithBlankHeaders, ','),
    [
      ['english', 'example', 'chinese', '', '', ''],
      ['hello', 'example', '你好', '', '', ''],
    ],
    'CSV row parsing should preserve blank header columns without inventing placeholder names'
  );

  const parsedObjectsWithBlankHeaders = parseDelimitedObjects(csvWithBlankHeaders, ',');
  assertDeepEqual(
    parsedObjectsWithBlankHeaders,
    {
      columns: ['english', 'example', 'chinese'],
      data: [
        { english: 'hello', example: 'example', chinese: '你好' },
      ],
    },
    'Delimited object parsing should drop completely blank header columns'
  );

  const csvWithUnnamedDataColumn = [
    'english,example,,',
    'hello,example,extra,',
  ].join('\n');
  assertDeepEqual(
    parseDelimitedObjects(csvWithUnnamedDataColumn, ','),
    {
      columns: ['english', 'example', 'column_3'],
      data: [
        { english: 'hello', example: 'example', column_3: 'extra' },
      ],
    },
    'Delimited object parsing should keep unnamed columns that contain data using stable names'
  );

  const tsvRows = [
    ['id', 'title', 'details'],
    ['1', 'Hello\tWorld', 'Multi\nLine'],
    ['2', 'Plain', 'Value'],
  ];
  const tsvRoundTrip = stringifyDelimitedRows(tsvRows, '\t');
  assertDeepEqual(
    parseDelimitedRows(tsvRoundTrip, '\t'),
    tsvRows,
    'TSV stringify should round-trip tabs and newlines'
  );

  const mergerFileA = 'id,name\n1,Alice\n2,Bob';
  const mergerFileB = 'id,name\n3,Carol\n4,Dan';
  const merged = [
    ...parseDelimitedRows(mergerFileA, ',').slice(1),
    ...parseDelimitedRows(mergerFileB, ',').slice(1),
  ];
  assertDeepEqual(
    merged,
    [
      ['1', 'Alice'],
      ['2', 'Bob'],
      ['3', 'Carol'],
      ['4', 'Dan'],
    ],
    'CSV merger should keep all rows in order'
  );

  const splitSource = parseDelimitedRows(
    [
      'team,member,notes',
      'Red,Alice,"alpha, one"',
      'Blue,Bob,"line 1',
      'line 2"',
      'Red,Carol,ok',
      'Blue,Dan,fine',
    ].join('\n'),
    ','
  );

  const columnSplit = splitByColumn(splitSource, 'team');
  assert(Object.keys(columnSplit).length === 2, 'Column split should create two groups');
  assertDeepEqual(
    parseDelimitedRows(stringifyDelimitedRows(columnSplit.Red, ','), ','),
    columnSplit.Red,
    'Column split export should preserve Red group content'
  );
  assertDeepEqual(
    parseDelimitedRows(stringifyDelimitedRows(columnSplit.Blue, ','), ','),
    columnSplit.Blue,
    'Column split export should preserve Blue group content'
  );

  const rowSplit = splitByRows(splitSource, 2);
  assert(Object.keys(rowSplit).length === 2, 'Row split should create two files');
  assert(rowSplit.part_1.length === 3, 'First split file should contain header plus two rows');
  assert(rowSplit.part_2.length === 3, 'Second split file should contain header plus two rows');

  const jsonSource = [
    { name: 'Alice', meta: { city: 'Paris' }, tags: ['a', 'b'] },
    { name: 'Bob', meta: { city: 'Tokyo' }, tags: ['c'] },
  ];
  assert(Array.isArray(jsonSource), 'JSON conversion source should be structured data, not filename-only conversion');

  const xmlRows = selectXmlRecordElements([
    '<Workbook>',
    '  <Worksheet>',
    '    <Table>',
    '      <Row><Cell><Data>name</Data></Cell><Cell><Data>city</Data></Cell></Row>',
    '      <Row><Cell><Data>Alice</Data></Cell><Cell><Data>Paris</Data></Cell></Row>',
    '      <Row><Cell><Data>Bob</Data></Cell><Cell><Data>Tokyo</Data></Cell></Row>',
    '    </Table>',
    '  </Worksheet>',
    '</Workbook>',
  ].join(''));
  assert(xmlRows.length === 3, 'XML record detection should prefer Row records over nested Cell nodes');

  console.log('validate:tools passed');
}

runValidation();
