// tslint:disable:ordered-imports

import "./polyfill";
import "core-js/es/promise";
import "core-js/es/map";

import {
  graphql,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";

global.doPost = (e: any) => {
  const query = JSON.parse(e.postData.contents).query;

  const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: "RootQueryType",
      // tslint:disable-next-line:object-literal-sort-keys
      fields: {
        hello: {
          type: GraphQLString,
          resolve() {
            return "world";
          },
        },
        meow: {
          type: GraphQLString,
          resolve() {
            return "world";
          },
        },
      },
    }),
  });

  let result: string = "unset";
  graphql(schema, query).then((r) => { result = JSON.stringify(r); });

  global.fakeEventLoop();
  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
};
