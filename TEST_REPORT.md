# Test Report

## Summary

This module is tested primarily using Vitest automatic unit testing but also by implementing a test app that runs a demo using some of the public methods.

### Install the module

To run the tests the module needs be cloned/downloaded from github to a local folder on your computer and installed.<br>
*Node.js is required to initiate the project, [Download here](https://nodejs.org/en)* 

In the project folder run:

`npm install`

Then proceed with either tests:

## Automatic tests
This module has been tested mostly automatically using Vitest unit tests. All public methods in the module has minimum of one test associated to it.

**How:**<br>
With the module installed locally run:

`npm run test:run` - This will trigger one run of all the tests associated with the module.

**Why:**<br>
Since the module is used primarily by developers I wanted to do testing that others are familiar with. I also want to learn more about Vitest and I like using the coverage functions to make sure most of the code gets tested.

## Manual testing (test app)
In addition to the automatic tests there is a also a test app (`test-app/app.ts`) that runs the whole flow once: load an image from a path, compress it, load an image from a URL, compress it, and create the default variants. This runs some of the important public methods and prints what it does in the console and the result are stored an `output` folder.

**How:**<br>
With the module installed locally, run `npm start`. This will trigger a run of a test app that calls some methods of the module and display some output in the console. It will compress and store files inside a folder in the project root. Make sure you delete these files after the test is done.

**Why:**<br>
Since the module doesn't have any GUI but I also wanted to test the module using a more hands on approach. While developing I find it hard to follow and build the code if I can't see the project in action. I like setting up functions/methods and calling them without any logic to see that parts connect before adding code. 


## Test Results

All tests are automated unit tests (Vitest) in `src/OptiPic.test.ts`, except the two rows marked **Manual** or **Indirect**. Some tests use a JPEG from a URL, and some use the local image `test-app/input/midsommartallrik.jpg`. All tests pass.

| What was tested | How it was tested | Result |
| --------------- | ----------------- | ------ |
| `load(source)` with a JPEG URL. | Loaded a JPEG from a URL and checked that it loads without an error. | ✅ Pass |
| `load(source)` with a source that is not a JPEG. | Loaded a URL ending in `.png` and checked that it rejects with `The image must be in jpg/jpeg format`. | ✅ Pass |
| `load(source)` when the URL request fails. | Replaced `fetch` with a fake that answers 404 and checked that `load` rejects with `Could not load image: 404`. | ✅ Pass |
| `load(source)` with a local file path. | **Indirect:** the `compressToFile()` tests load the local image in their setup. If loading had failed, those tests would have failed. | ✅ Pass |
| `getMetadata()` before any image is loaded. | Created an `OptiPic` instance without calling `load` and checked that `getMetadata()` throws `No image has been loaded`. | ✅ Pass |
| `getMetadata()` after `load()`. | Loaded a JPEG and checked that format, height, width and size exist and have the right types. | ✅ Pass |
| `compressToFile()` saves the image with the given name and width. | Compressed to 300 px with the name `test-to-file`, read the saved file with `sharp` and checked that the width is 300. | ✅ Pass |
| `compress()` still works and warns that it is deprecated. | Called `compress()` with a spy on `console.warn`. Checked that the warning contains `deprecated` and that the file was saved. | ✅ Pass |
| `compressToBuffer()` returns image data. | Compressed to 400 px and checked that the result is a `Buffer` with data in it. | ✅ Pass |
| `compressToBuffer()` when the size limit cannot be reached. | Set `maxSizeKB` to 1 and checked that it rejects with `Could not reach target file size`. | ✅ Pass |
| `compressVariantsToBuffers()` without arguments. | Read the width of every returned buffer with `sharp` and checked that they match the default variant widths. | ✅ Pass |
| `compressVariantsToBuffers()` with given widths and size limits. | Passed two variants (300 px, and 600 px with max 80 KB) and checked the widths, the order and that the second buffer is under 80 KB. | ✅ Pass |
| `compressVariantsToBuffers()` when a variant has no width. | Passed `[{ width: 300 }, { maxSizeKB: 100 }]` and checked that the second variant gets the default width for its position. | ✅ Pass |
| `compressVariantsToBuffers()` with more variants than default widths. | Passed four empty variants and checked that the fourth gets the single image default width. | ✅ Pass |
| `compressVariantsToBuffers()` before any image is loaded. | Called it on a new instance and checked that it rejects with `No image has been loaded`. | ✅ Pass |
| `compressVariantsToFiles()` saves every variant. | Saved two variants (600 px and 1200 px) with given names, read the files with `sharp` and checked the widths. | ✅ Pass |
| `load(source)` with a local file path, then `getMetadata()` and `compressToFile()` with the defaults. | **Manual:** ran `npm start`. The app loads `midsommartallrik.jpg` from `test-app/input`, prints the height, width, format and size, and compresses it with the defaults (1200 px, max 400 KB). Checked that the metadata was printed and that a file named like `a1b2c3-w1200.jpg` was created in `output/`. | ✅ Pass |
| `load(source)` with a URL, then `getMetadata()` and `compressToFile()` with the defaults. | **Manual:** same run. The app loads the Pexels JPEG from a URL, prints the metadata, and compresses it with the defaults. Checked that the printed metadata is for the new image and that a second `-w1200.jpg` file was created in `output/`. | ✅ Pass |
| `compressVariantsToFiles()` without arguments. | **Manual:** same run. The app creates the default variants of the URL image. Checked that three more files were created in `output/`, ending in `-w480.jpg`, `-w768.jpg` and `-w1280.jpg`, and that they open as images of those widths. | ✅ Pass |

### Coverage

Run with `npm run test:run -- --coverage`. Result: `OptiPic.ts` <fill in>% statements, `ImageCompressor.ts` <fill in>% statements. Coverage only shows which lines ran. It does not show if the tests check the right things.

### Not covered
- `compressVariantsToFiles()` without arguments, and the case where one variant fails (nothing should be saved).
- Two variants with the same `outputName`. The second file overwrites the first.
- `load(source)` with a local path has no test of its own.

### Known bugs

Found during code review but not fixed: `isUrl` treats any path containing `http` as a URL, and `validateImageFormat` accepts names such as `notajpg`.
