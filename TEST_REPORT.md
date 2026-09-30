# Test Report

<!--
    Commit this file to the root of your GitHub repository, alongside your module's code.


## Summary

<!--
Briefly describe how you tested your module, and why you chose that approach — clearly enough
that someone else could carry out the same tests.
-->

Since the project is built on a template using Vitest for testing I decided to use this to perform unit tests on the module's methods. Most of the methods should be covered and a table of each can be seen below.

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
