import "./polyfill";
// tslint:disable-next-line:ordered-imports
import "core-js";

import {
  graphql,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";

global.main = () => {
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
      },
    }),
  });

  const query = "{ hello }";

  graphql(schema, query).then((result) => {
    // Prints
    // {
    //   data: { hello: "world" }
    // }
    Logger.log(JSON.stringify(result));
  }).catch((e) => Logger.log(e));

  global.fakeEventLoop();
};

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
      },
    }),
  });

  let result: string = "unset";
  graphql(schema, query).then((r) => {
    // Prints
    // {
    //   data: { hello: "world" }
    // }
    result = JSON.stringify(r);
  });

  global.fakeEventLoop();

  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
}