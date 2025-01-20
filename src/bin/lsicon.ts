#!/usr/bin/env node

import { createRequire } from "node:module";
import { Command } from "commander";

import { cliPackagePath } from "../path.js";
import create from "../create.js";
import build from "../build.js";

const require = createRequire(import.meta.url);

const cliPackage = require(cliPackagePath);

const lsicon = new Command();

lsicon
  .name("lsicon")
  .description("Help you quickly build your own icon set.")
  .version(cliPackage.version)

lsicon
  .command("create")
  .description("Create your own icon set now.")
  .argument("[name]", "The name of your icon set, which will be published to npm. You need to ensure that the name is available.")
  .action((name) => {
    create(name)
  })

lsicon
  .command("build")
  .description("Build the icon set from the figma file.")
  .requiredOption("-f, --file <figma_file_id>", "The figma file id you want to use for managing icons.")
  .requiredOption("-p, --page <figma_file_page>", "The figma file page you want to use for managing icons.")
  .requiredOption("-t, --token <figma_token>", "The figma account token, which will be used to access the figma file and download icons.")
  .requiredOption("--style <style>", "The default style name, ")
  .action((options) => {
    build(options)
  })

lsicon.parse();
