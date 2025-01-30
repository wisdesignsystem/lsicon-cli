import { createRequire } from "node:module";
import path from "node:path";
import fs from "node:fs";
import { transform } from "@svgr/core";
import ora from "ora";
import { $ } from "zx";
import { rollup } from "rollup";
import resolve from "@rollup/plugin-node-resolve";
import esbuild from "rollup-plugin-esbuild";
import rollupTypescript from "rollup-plugin-typescript2";

import { appPackagePath, iconComponentsPath, runtimePath } from "./path.js";

const require = createRequire(import.meta.url);

const setLsicon = {
  name: "setLsicon",
  description: "Set lsicon set",
  fn: () => {
    return {
      element: {
        // @ts-ignore
        enter(node) {
          if (node.name === "svg") {
            node.attributes["data-role"] = "lsicon";
          }

          if (node.attributes.fill && node.attributes.fill !== "none") {
            node.attributes.fill = "currentColor";
          }

          if (node.attributes.stroke && node.attributes.stroke !== "none") {
            node.attributes.stroke = "currentColor";
          }

          if (!node.attributes.fill || node.attributes.fill === "none") {
            // biome-ignore lint/performance/noDelete: <explanation>
            delete node.attributes["stroke-linecap"];
            // biome-ignore lint/performance/noDelete: <explanation>
            delete node.attributes["stroke-linejoin"];
            // biome-ignore lint/performance/noDelete: <explanation>
            delete node.attributes["stroke-width"];

            // biome-ignore lint/performance/noDelete: <explanation>
            delete node.attributes.strokeLineCap;
            // biome-ignore lint/performance/noDelete: <explanation>
            delete node.attributes.strokeLineJoin;
            // biome-ignore lint/performance/noDelete: <explanation>
            delete node.attributes.strokeWidth;
          }
        },
      },
    };
  },
};

function writeFile(filePath: string, content: string) {
  fs.writeFileSync(filePath, content);
}

async function build() {
  const iconPackageJson = require(appPackagePath);
  if (!iconPackageJson.lsicon) {
    throw new Error("No icons found");
  }

  const spin = ora({});
  spin.start();

  await $`rm -rf ${iconComponentsPath}`;
  await $`mkdir ${iconComponentsPath}`;

  const exportIcons = [];

  for (const icon of iconPackageJson.lsicon.icons) {
    const code = await transform(
      icon.fileContent,
      {
        icon: true,
        typescript: true,
        plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx"],
        svgoConfig: {
          plugins: ["sortAttrs", setLsicon],
        },
      },
      { componentName: icon.fileName }
    );

    writeFile(path.resolve(iconComponentsPath, `${icon.fileName}.tsx`), code);
    exportIcons.push(
      `export { default as ${icon.fileName} } from "./${icon.fileName}.tsx";`
    );
  }

  writeFile(
    path.resolve(iconComponentsPath, "index.ts"),
    exportIcons.join("\n")
  );

  const outputPath = path.resolve(runtimePath, "dist");
  await $`rm -rf ${outputPath}`;
  const bundle = await rollup({
    input: path.resolve(iconComponentsPath, "index.ts"),
    plugins: [
      // @ts-ignore
      resolve({ extensions: [".ts", ".tsx"] }),
      // @ts-ignore
      rollupTypescript(),
      esbuild(),
    ],
    external: /node_modules/,
  })

  await bundle.write({
    file: path.resolve(outputPath, 'index.js'),
    format: "esm",
  })

  spin.succeed("done");
  console.info();
}

export default build;
