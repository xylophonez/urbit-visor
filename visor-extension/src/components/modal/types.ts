export type SVG = HTMLElement & SVGElement;

export interface Command {
  command: String;
  icon?: SVG;
  title: String;
  description: String;
  arguments: string[]
  schema: (props: any[]) => {}
}
