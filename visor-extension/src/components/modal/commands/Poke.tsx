import { Command } from "../types";

export const Poke: Command = {
  command: 'poke',
  title: 'Poke',
  description: 'poke an agent on your ship',
  arguments: ['app', 'mark', 'json']
}
