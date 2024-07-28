// yup.d.ts
import "yup";
import { QuerySchemaMeta } from "../src/hooks/query";

declare module "yup" {
	// Define your desired `SchemaMetadata` interface by merging the
	// `CustomSchemaMetadata` interface.
	export interface CustomSchemaMetadata {
		
	}

	export interface SchemaMetadata extends QuerySchemaMeta {}
}
