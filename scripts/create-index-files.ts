import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';

const SRC_DIR = path.join(__dirname, '..', 'src');

// Función para crear el archivo index.ts en un directorio
function createIndexFile(directory: string) {
  const entityFiles = glob.sync('*.entity.ts', { cwd: directory });
  
  if (entityFiles.length === 0) {
    console.log(`No entity files found in ${directory}`);
    return;
  }

  const exports = entityFiles
    .map(file => `export * from './${path.basename(file, '.ts')}';`)
    .join('\n');

  const indexContent = `// Generated index file
${exports}
`;

  const indexPath = path.join(directory, 'index.ts');
  fs.writeFileSync(indexPath, indexContent);
  console.log(`Created index.ts in ${directory}`);
}

// Función para actualizar las importaciones en un archivo
function updateImports(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(path.dirname(filePath), SRC_DIR);
  
  // Patrón para encontrar importaciones con @/
  const importPattern = /import\s+{([^}]+)}\s+from\s+['"]@\/([^'"]+)['"]/g;
  
  let updatedContent = content;
  let match;
  
  while ((match = importPattern.exec(content)) !== null) {
    const [fullMatch, imports, modulePath] = match;
    const newPath = path.join(relativePath, modulePath).replace(/\\/g, '/');
    const newImport = `import {${imports}} from '${newPath}'`;
    updatedContent = updatedContent.replace(fullMatch, newImport);
  }

  if (updatedContent !== content) {
    fs.writeFileSync(filePath, updatedContent);
    console.log(`Updated imports in ${filePath}`);
  }
}

// Función principal
function main() {
  // Encontrar todos los directorios que contienen archivos .entity.ts
  const entityDirs = glob.sync('**/*.entity.ts', { cwd: SRC_DIR })
    .map(file => path.dirname(path.join(SRC_DIR, file)))
    .filter((dir, index, self) => self.indexOf(dir) === index);

  // Crear archivos index.ts
  entityDirs.forEach(dir => createIndexFile(dir));

  // Actualizar importaciones en todos los archivos .ts
  const tsFiles = glob.sync('**/*.ts', { 
    cwd: SRC_DIR,
    ignore: ['**/node_modules/**', '**/dist/**', '**/migrations/**']
  });

  tsFiles.forEach(file => {
    const filePath = path.join(SRC_DIR, file);
    updateImports(filePath);
  });
}

main(); 