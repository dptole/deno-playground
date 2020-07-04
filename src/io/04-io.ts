/*
  deno run --allow-read --allow-write src/io/04-io.ts
*/
const thisFile = new URL(import.meta.url).pathname;
const mainwd = Deno.cwd();
const foldersContents = {} as any;

console.log("Check file stats of", thisFile);

Deno.lstat(thisFile).then((stat) => {
  console.log(stat);
  console.log("");

  console.log("Creating a temporary file as a copy of this code");
  return Deno.makeTempFile().then((tmpFilePath) =>
    Deno.copyFile(thisFile, tmpFilePath).then(() =>
      console.log("The code was copied to", tmpFilePath)
    ).then(() => {
      console.log("Removing the temporary file");
      return Deno.remove(tmpFilePath);
    })
  );
}).then(() => {
  console.log("");

  while (1) {
    const cwd = Deno.cwd();

    if (!(cwd in foldersContents)) {
      foldersContents[cwd] = {
        files: 0,
        dirs: 0,
        symlinks: 0,
      };
    }

    console.log("Scanning directory", cwd, "...");

    for (const dirEntry of Deno.readDirSync(".")) {
      const foldersContentsIndex = dirEntry && dirEntry.isSymlink
        ? "symlinks"
        : dirEntry && dirEntry.isDirectory
        ? "dirs"
        : "files";

      foldersContents[cwd][foldersContentsIndex]++;
    }

    Deno.chdir("..");

    if (cwd === "/") {
      break;
    }
  }

  console.log("");

  Deno.chdir(mainwd);

  console.log("Directories' contents");
  console.log(foldersContents);
  console.log("");
}).catch((e) => {
  console.log(e);
});
