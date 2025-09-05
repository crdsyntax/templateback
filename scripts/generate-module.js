const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error(
    "❌ Debes proporcionar el nombre del módulo. Ej: node scripts/generate-module.js nombreModulo",
  );
  process.exit(1);
}

const moduleName = args[0];
const kebabName = moduleName.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
const className = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
const moduleDir = `src/${kebabName}`;

console.log(`🛠️ Generando módulo ${kebabName}...`);
execSync(`npx nest g module ${kebabName}`, { stdio: "inherit" });

const folders = ["services", "controllers", "dto", "schemas", "tests"];
folders.forEach((folder) => {
  const fullPath = path.join(moduleDir, folder);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`📁 Carpeta creada: ${fullPath}`);
  }
});

const entityFile = path.join(moduleDir, "schemas", `${kebabName}.schema.ts`);
if (!fs.existsSync(entityFile)) {
  fs.writeFileSync(
    entityFile,
    `import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class ${className} {
  @PrimaryGeneratedColumn()
  id: number;

  @Prop()
  name: string;
}
export const ${className}Schema = SchemaFactory.createForClass(${className});
`,
  );
  console.log(`📄 Entity creada: ${entityFile}`);
}

const dtoFile = path.join(moduleDir, "dto", `create-${kebabName}.dto.ts`);
if (!fs.existsSync(dtoFile)) {
  fs.writeFileSync(
    dtoFile,
    `import { ApiProperty } from '@nestjs/swagger';

export class Create${className}Dto {
  @ApiProperty()
  name: string;
}
`,
  );
  console.log(`📄 DTO creado: ${dtoFile}`);
}

execSync(`npx nest g service ${kebabName}`, { stdio: "inherit" });
fs.renameSync(
  `${moduleDir}/${kebabName}.service.ts`,
  `${moduleDir}/services/${kebabName}.service.ts`,
);
fs.renameSync(
  `${moduleDir}/${kebabName}.service.spec.ts`,
  `${moduleDir}/tests/${kebabName}.service.spec.ts`,
);

execSync(`npx nest g controller ${kebabName}`, { stdio: "inherit" });
fs.renameSync(
  `${moduleDir}/${kebabName}.controller.ts`,
  `${moduleDir}/controllers/${kebabName}.controller.ts`,
);
fs.renameSync(
  `${moduleDir}/${kebabName}.controller.spec.ts`,
  `${moduleDir}/tests/${kebabName}.controller.spec.ts`,
);

console.log(
  `✅ Módulo ${className} generado exitosamente con estructura completa.`,
);
