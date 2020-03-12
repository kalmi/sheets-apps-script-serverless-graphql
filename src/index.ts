// Polyfill must be imported before graphql
import {runFakeEventLoop} from "./polyfill";

import {
  graphql,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
} from "graphql";

global.doPost = (e: GoogleAppsScript.Events.DoPost) => {
  const query = JSON.parse(e.postData.contents).query;

  const schema = generateSchema();

  let result: string;
  graphql(schema, query).then((r) => { result = JSON.stringify(r); });

  runFakeEventLoop();
  if (!result) { throw new Error('Result was not set.'); }
  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
};

function generateSchema() {
  const TABLE_PREFIX = "graphql:";

  const sheets: {[x: string]: GoogleAppsScript.Spreadsheet.Sheet} = {};

  const types = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheets()
    .map((sheet) => ({name: sheet.getName(), sheet}))
    .filter(({name}) => name.indexOf(TABLE_PREFIX) === 0)
    .map(({name, sheet}) => ({name: name.substring(TABLE_PREFIX.length), sheet}))
    .map(({name: sheetName, sheet}) => {

      const headerRow = sheet
        .getRange("1:1")
        .getValues()[0]
        .map((columnName, index) => (columnName ? {columnName, index} : undefined))
        .filter((x) => x);

      const type = new GraphQLObjectType({
        fields: headerRow.reduce((acc, column) => {
          acc[column.columnName] = {type: GraphQLString };
          return acc;
        }, {}),
        name: sheetName,
      });

      sheets[sheetName] = sheet;

      return type;
    });

  const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: "Query",
      fields: types.reduce((acc, type) => {
        acc[type.name] = {
          type: new GraphQLList(type),
          resolve: () => {
            const sheet = sheets[type.name];
            const allRows = sheet.getSheetValues(1,1,-1,-1);
            const [headerRow, ...dataRows] = allRows; 
            return dataRows.map(
              row => Object.fromEntries(headerRow.map(
                (header: string, i) => [header, row[i]]
              ))
            );
          },
        };
        return acc;
      }, {}),
    }),
  });

  return schema;
}
