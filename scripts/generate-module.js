const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error(
    "❌ Debes proporcionar el nombre del módulo. Ej: node scripts/generate-module.js nombreModulo"
  );
  process.exit(1);
}

const moduleName = args[0];
const kebabName = moduleName
  .replace(/([a-z])([A-Z])/g, "$1-$2")
  .toLowerCase();
const className = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
const moduleDir = `src/${kebabName}`;

console.log(`🛠️ Generando módulo ${kebabName}...`);

if (!fs.existsSync(moduleDir)) {
  fs.mkdirSync(moduleDir, { recursive: true });
}

const folders = ["services", "controllers", "dto", "schemas", "tests", "resources"];
folders.forEach((folder) => {
  const fullPath = path.join(moduleDir, folder);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`📁 Carpeta creada: ${fullPath}`);
  }
});

execSync(`npx nest g module ${kebabName}`, { stdio: "inherit" });

const schemaFile = path.join(moduleDir, "schemas", `${kebabName}.schema.ts`);
fs.writeFileSync(
  schemaFile,
  `import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type ${className}Document = ${className} & Document & { _id: Types.ObjectId };

@Schema({ timestamps: true })
export class ${className} {
  @Prop({ required: true })
  name: string;
}

export const ${className}Schema = SchemaFactory.createForClass(${className});
`
);
console.log(`📄 Schema creada: ${schemaFile}`);

const createDtoFile = path.join(moduleDir, "dto", `create-${kebabName}.dto.ts`);
fs.writeFileSync(
  createDtoFile,
  `import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class Create${className}Dto {
  @ApiProperty()
  @IsString()
  name: string;
}
`
);
console.log(`📄 DTO creado: ${createDtoFile}`);

const updateDtoFile = path.join(moduleDir, "dto", `update-${kebabName}.dto.ts`);
fs.writeFileSync(
  updateDtoFile,
  `import { PartialType } from '@nestjs/swagger';
import { Create${className}Dto } from './create-${kebabName}.dto';

export class Update${className}Dto extends PartialType(Create${className}Dto) {}
`
);
console.log(`📄 DTO de actualización creado: ${updateDtoFile}`);

const resourceFile = path.join(moduleDir, "resources", `${kebabName}.resource.ts`);
fs.writeFileSync(
  resourceFile,
  `import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ${className}, ${className}Document } from '../schemas/${kebabName}.schema';
import { Create${className}Dto } from '../dto/create-${kebabName}.dto';
import { Update${className}Dto } from '../dto/update-${kebabName}.dto';

@Injectable()
export class ${className}Resource {
  constructor(
    @InjectModel(${className}.name) private ${moduleName}Model: Model<${className}Document>,
  ) {}

  async create(create${className}Dto: Create${className}Dto): Promise<${className}Document> {
    const created${className} = new this.${moduleName}Model(create${className}Dto);
    return created${className}.save();
  }

  async findAll(): Promise<${className}Document[]> {
    return this.${moduleName}Model.find().exec();
  }

  async findOne(id: string): Promise<${className}Document| null> {
    return this.${moduleName}Model.findById(id).exec();
  }

  async update(id: string, update${className}Dto: Update${className}Dto): Promise<${className}Document| null> {
    return this.${moduleName}Model
      .findByIdAndUpdate(id, update${className}Dto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<${className}Document| null> {
    return this.${moduleName}Model.findByIdAndDelete(id).exec();
  }

  async count(): Promise<number> {
    return this.${moduleName}Model.countDocuments().exec();
  }
}
`
);
console.log(`📄 Resource creado: ${resourceFile}`);

const serviceFile = path.join(moduleDir, "services", `${kebabName}.service.ts`);
fs.writeFileSync(
  serviceFile,
  `import { Injectable } from '@nestjs/common';
import { ${className}Resource } from '../resources/${kebabName}.resource';
import { Create${className}Dto } from '../dto/create-${kebabName}.dto';
import { Update${className}Dto } from '../dto/update-${kebabName}.dto';
import { ${className}Document } from '../schemas/${kebabName}.schema';

@Injectable()
export class ${className}Service {
  constructor(private readonly ${moduleName}Resource: ${className}Resource) {}

  async create(create${className}Dto: Create${className}Dto): Promise<${className}Document> {
    return this.${moduleName}Resource.create(create${className}Dto);
  }

  async findAll(): Promise<${className}Document[]> {
    return this.${moduleName}Resource.findAll();
  }

  async findOne(id: string): Promise<${className}Document| null> {
    return this.${moduleName}Resource.findOne(id);
  }

  async update(id: string, update${className}Dto: Update${className}Dto): Promise<${className}Document| null> {
    return this.${moduleName}Resource.update(id, update${className}Dto);
  }

  async remove(id: string): Promise<${className}Document| null> {
    return this.${moduleName}Resource.remove(id);
  }

  async count(): Promise<number> {
    return this.${moduleName}Resource.count();
  }
}
`
);
console.log(`📄 Servicio creado: ${serviceFile}`);

const controllerFile = path.join(moduleDir, "controllers", `${kebabName}.controller.ts`);
fs.writeFileSync(
  controllerFile,
  `import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ${className}Service } from '../services/${kebabName}.service';
import { Create${className}Dto } from '../dto/create-${kebabName}.dto';
import { Update${className}Dto } from '../dto/update-${kebabName}.dto';
import { ${className}Document } from '../schemas/${kebabName}.schema';

@ApiTags('${kebabName}')
@Controller('${kebabName}')
export class ${className}Controller {
  constructor(private readonly ${moduleName}Service: ${className}Service) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo ${kebabName}' })
  @ApiResponse({ status: 201, description: '${className} creado exitosamente.' })
  create(@Body() create${className}Dto: Create${className}Dto): Promise<${className}Document> {
    return this.${moduleName}Service.create(create${className}Dto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los ${kebabName}s' })
  @ApiResponse({ status: 200, description: 'Lista de ${kebabName}s obtenida exitosamente.' })
  findAll(): Promise<${className}Document[]> {
    return this.${moduleName}Service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un ${kebabName} por ID' })
  @ApiResponse({ status: 200, description: '${className} encontrado.' })
  @ApiResponse({ status: 404, description: '${className} no encontrado.' })
  findOne(@Param('id') id: string): Promise<${className}Document| null> {
    return this.${moduleName}Service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un ${kebabName} por ID' })
  @ApiResponse({ status: 200, description: '${className} actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: '${className} no encontrado.' })
  update(@Param('id') id: string, @Body() update${className}Dto: Update${className}Dto): Promise<${className}Document| null> {
    return this.${moduleName}Service.update(id, update${className}Dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un ${kebabName} por ID' })
  @ApiResponse({ status: 200, description: '${className} eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: '${className} no encontrado.' })
  remove(@Param('id') id: string): Promise<${className}Document| null> {
    return this.${moduleName}Service.remove(id);
  }

  @Get('count/all')
  @ApiOperation({ summary: 'Obtener el conteo total de ${kebabName}s' })
  @ApiResponse({ status: 200, description: 'Conteo obtenido exitosamente.' })
  count(): Promise<number> {
    return this.${moduleName}Service.count();
  }
}
`
);
console.log(`📄 Controlador creado: ${controllerFile}`);

const moduleFile = `${moduleDir}/${kebabName}.module.ts`;
fs.writeFileSync(
  moduleFile,
  `import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ${className}Controller } from './controllers/${kebabName}.controller';
import { ${className}Service } from './services/${kebabName}.service';
import { ${className}Resource } from './resources/${kebabName}.resource';
import { ${className}, ${className}Schema } from './schemas/${kebabName}.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ${className}.name, schema: ${className}Schema }]),
  ],
  controllers: [${className}Controller],
  providers: [${className}Service, ${className}Resource],
  exports: [${className}Service],
})
export class ${className}Module {}
`
);
console.log(`📄 Módulo creado: ${moduleFile}`);

console.log(`✅ Módulo ${className} generado exitosamente con estructura completa.`);