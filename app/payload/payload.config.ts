import { mongooseAdapter } from '@payloadcms/db-mongodb'
import dotenv from 'dotenv'
import path from 'path'
import { buildConfig } from 'payload/config'
import { CategoriesCollection } from './collections/Categories/index.js'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

const mockModulePath = path.resolve(__dirname, './emptyModuleMock.js')

dotenv.config({
  path: path.resolve(__dirname, '../../.env'),
})

export default buildConfig({
  editor: lexicalEditor({}), // editor-config
  // database-adapter-config-start
  db: mongooseAdapter({
    url: process.env.MONGO_URL as string,
  }),
  // database-adapter-config-end
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL,
  collections: [CategoriesCollection],
  //   globals: [Settings, Header, Footer],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
})
