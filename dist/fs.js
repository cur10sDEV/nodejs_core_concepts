"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = require("fs/promises");
const promises_2 = require("readline/promises");
init();
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        const rl = (0, promises_2.createInterface)({
            input: process.stdin,
            output: process.stdout,
        });
        while (true) {
            console.log(`\nOperations:\n1. Create a File\n2. Delete a File\n3. Rename a File\n4. Exit\n`);
            yield processUserInput(rl);
        }
    });
}
function processUserInput(rl) {
    return __awaiter(this, void 0, void 0, function* () {
        const operation = parseInt(yield rl.question("Enter value - 1/2/3/4: "));
        if (operation >= 1 && operation <= 4) {
            // exit
            if (operation === 4) {
                console.log("Program exited successfully");
                process.exit();
            }
            const fileName = yield rl.question("Name of the file: ");
            // create a file
            if (operation === 1) {
                yield createFile(fileName);
            }
            // delete a file
            else if (operation === 2) {
                yield deleteFile(fileName);
            }
            // rename a file
            else if (operation === 3) {
                const newFileName = yield rl.question("New name for the file: ");
                yield renameFile(fileName, newFileName);
            }
        }
        else {
            console.error("Incorrect Operation!");
            return;
        }
    });
}
function createFile(file) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const fileExistsHandler = yield (0, promises_1.open)(file, "r");
            yield (fileExistsHandler === null || fileExistsHandler === void 0 ? void 0 : fileExistsHandler.close());
            console.log(`File "${file}" already exists`);
        }
        catch (error) {
            let newFileHandler;
            newFileHandler = yield (0, promises_1.open)(file, "w");
            console.log(`File "${file}" created successfully`);
            yield (newFileHandler === null || newFileHandler === void 0 ? void 0 : newFileHandler.close());
        }
    });
}
function deleteFile(file) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const fileExistsHandler = yield (0, promises_1.open)(file, "r");
            yield fileExistsHandler.close();
            yield (0, promises_1.unlink)(file);
            console.log(`File "${file}" deleted successfully`);
        }
        catch (error) {
            console.log(`File "${file}" does not exist`);
        }
    });
}
function renameFile(oldFileName, newFileName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, promises_1.rename)(oldFileName, newFileName);
            console.log(`File "${oldFileName}" renamed to "${newFileName}" successfully`);
        }
        catch (error) { }
    });
}
