import React from "react";

export interface Command {
  command: String;
  icon?: React.FunctionComponent;
  title: String;
  description: String;
  arguments: string[];
  schema: ((props: any[]) => {})[]
  schemaArgs?: any[];
}
