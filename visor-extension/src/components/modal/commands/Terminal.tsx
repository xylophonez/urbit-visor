import { Command } from "../types";

export const Terminal: Command = {
  command: 'poke',
  title: 'Terminal',
  description: 'connect to dojo terminal',
  arguments: ['command'],
  schema: (props: any[]) => ({app: 'herm', mark: 'belt', json: { txt: [props[0].innerHTML] }})
}
