import * as fs from 'fs'

const currentDir = new URL('.', import.meta.url).pathname

// readthe schema from the types.schema.json file in the same directory
const schema = JSON.parse(fs.readFileSync(currentDir + '/types.schema.json', 'utf8'))

const generateEnum = (name, values) => {
    return `export enum ${name} {
${values.map((value) => `  ${value} = "${value}"`).join(',\n')}
}\n`
}

let tsOutput = ''
for (const [name, type] of Object.entries(schema)) {
    tsOutput += generateEnum(name, type.enum)
}

// One directory up, write the generated file
fs.writeFileSync(currentDir + '/../genTypes.ts', tsOutput)

console.log('Typescript enums generated successfully!')
