import { Command } from "../types";

export const Spider: Command = {
  command: 'thread',
  title: 'Thread',
  description: 'run a thread on your ship',
  arguments: ['thread name', 'desk', 'input mark', 'output mark', 'body']
}
