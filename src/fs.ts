import { open, rename, unlink } from "fs/promises";
import { createInterface, Interface } from "readline/promises";

init();

async function init() {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  while (true) {
    console.log(
      `\nOperations:\n1. Create a File\n2. Delete a File\n3. Rename a File\n4. Exit\n`
    );

    await processUserInput(rl);
  }
}

async function processUserInput(rl: Interface) {
  const operation = parseInt(await rl.question("Enter value - 1/2/3/4: "));

  if (operation >= 1 && operation <= 4) {
    // exit
    if (operation === 4) {
      console.log("Program exited successfully");
      process.exit();
    }

    const fileName = await rl.question("Name of the file: ");

    // create a file
    if (operation === 1) {
      await createFile(fileName);
    }

    // delete a file
    else if (operation === 2) {
      await deleteFile(fileName);
    }

    // rename a file
    else if (operation === 3) {
      const newFileName = await rl.question("New name for the file: ");
      await renameFile(fileName, newFileName);
    }
  } else {
    console.error("Incorrect Operation!");
    return;
  }
}

async function createFile(file: string) {
  try {
    const fileExistsHandler = await open(file, "r");
    await fileExistsHandler?.close();
    console.log(`File "${file}" already exists`);
  } catch (error) {
    let newFileHandler;
    newFileHandler = await open(file, "w");
    console.log(`File "${file}" created successfully`);
    await newFileHandler?.close();
  }
}

async function deleteFile(file: string) {
  try {
    const fileExistsHandler = await open(file, "r");
    await fileExistsHandler.close();
    await unlink(file);
    console.log(`File "${file}" deleted successfully`);
  } catch (error) {
    console.log(`File "${file}" does not exist`);
  }
}

async function renameFile(oldFileName: string, newFileName: string) {
  try {
    await rename(oldFileName, newFileName);
    console.log(
      `File "${oldFileName}" renamed to "${newFileName}" successfully`
    );
  } catch (error) {}
}
