import yargs from "yargs";

const { argv } = yargs
  .options({})
  .demandCommand(1, "You need at least one command before moving on")
  .help();

console.log(argv);
