import { Command } from "commander";
import { generate } from "./commands/generate";

export function cli(args) {
  const program = new Command();

  program
    .command("gen")
    .description("Generate the static site")
    .action(generate);

  program.parse(args);
}
