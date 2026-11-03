# Test Report

<!--
    Commit this file to the root of your GitHub repository, alongside your module's code.


## Summary

<!--
Briefly describe how you tested your module, and why you chose that approach — clearly enough
that someone else could carry out the same tests.
-->

### Automatic tests
This module has been tested mostly automatically using Vitest unit tests. All public methods in the module has minimum of one test associated to it.

**- How:**
With the module installed locally (see README) run:

`npm run test` - To have 

**- Why:**
Since the module is made as a part that developers

### Manual testing
On top of the automatic tests there is a also a test app with a minimal implementation of the module. This 

**- How:** With the module installed locally, run `npm start`. This will trigger a run of the m

**- Why:** Since the module doesn't have any GUI but I also wanted to test the module using a more hands on approach. While developing I find it hard to follow and build the code if I can't see the project in action. I like setting up functions/methods and calling them without any logic to see that parts connect before adding code. 


## Test Results

| What was tested | How it was tested | Result |
| --------------- | ----------------- | ------ |
| `load(source)` with a JPEG URL, and `getMetadata()` returning the stored metadata. | Automated unit test (Vitest): loaded a JPEG from a URL, called `getMetadata()` and checked that format, width, height and size are correct. | ✅ Pass |
| `getMetadata()` before any image is loaded. | Automated unit test (Vitest): created an `OptiPic` instance without calling `load` and checked that `getMetadata()` throws `No image has been loaded`. | ✅ Pass |
| `load(source)` with a source that is not a JPEG. | Automated unit test (Vitest): called `load('picture.png')` and checked that it rejects with `The image must be in jpg/jpeg format`. | ✅ Pass |
| `load(source)` followed by `compress({ width, outputName })` on a JPEG URL. | Manual test with the test app (`npm start`): loaded a JPEG from a URL, compressed it to 700 px width with the default 400 KB limit, and checked that the metadata was printed and that `output/hello.jpg` was created. | ✅ Pass |

### Not covered

- Loading from a local file path.
- The error when the target file size cannot be reached.
- Calling `compress()` before `load()`.

Known bugs found during code review but not fixed: `isUrl` treats any path containing `http` as a URL, and `validateImageFormat` accepts names such as `notajpg`.
- Calling `getMetadata()` or `compress()` before `load()`.
