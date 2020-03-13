 /* tslint:disable */ 

declare namespace glFunctions {
  interface global {
    [x: string]: any;
    main(): void;
  }
}

declare var global: glFunctions.global;
