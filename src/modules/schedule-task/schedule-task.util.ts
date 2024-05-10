import * as fs from 'fs';

export function getExecuteFile(folderPath: string) {
  const allFiles = fs.readdirSync(folderPath);
  const sortedFiles = allFiles.sort((name1: string, name2: string) => {
    return name1 < name2 ? 1 : -1;
  });
  const executeFile = sortedFiles[0] || '';

  return executeFile;
}
