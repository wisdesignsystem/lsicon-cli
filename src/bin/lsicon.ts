#!/usr/bin/env node

import { createRequire } from "node:module";
import { Command } from "commander";

import { cliPackagePath } from "../path.js";
import build from "../build.js";

const require = createRequire(import.meta.url);

const cliPackage = require(cliPackagePath);

const lsicon = new Command();

lsicon
  .name("lsicon")
  .description("Help you quickly build your own icon set.")
  .version(cliPackage.version)

lsicon
  .command("build")
  .description("Build the icon sets.")
  .action(() => {
    build()
  })

lsicon.parse();
