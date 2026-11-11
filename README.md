# OptiPic Image Optimizer

Optimize JPEG images for the web. OptiPic takes large, high-resolution images, from a local file or a URL, and saves smaller versions for faster loading, better SEO and a smaller footprint.

## Overview

OptiPic makes it easy for your application to accept images of any size and turn them into web-ready versions without any extra work from your users. You load an image, choose a width and a maximum file size, and OptiPic finds the highest JPEG quality that still fits within your size limit.

This module was made for the course **1DV610** at Linnaeus University, 2026.

### What it does

- Loads JPEG images from a **local file path** or a **URL**.
- Reads image metadata (format, width, height, size).
- Resizes the image to a given width.
- Compresses the image to a maximum file size in KB by lowering the JPEG quality step by step.
- Saves the result to an `output` folder, with a chosen or automatically generated file names.

### What it does not do

- It only supports **JPG/JPEG** input, and output is always JPEG.
- It does not convert between formats, crop, rotate or edit images.
- It does not upload images anywhere. Files are only written to the local `output` folder.

## Table of contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [API](#api)
- [Error handling](#error-handling)
- [Development](#development)
- [Project structure](#project-structure)
- [License & Author](#license--author)

## Features

- **Files & URLs:** Load images stored locally or online.
- **Size limit:** Set a maximum file size in KB. OptiPic lowers the quality until the image fits.
- **Resizing:** Set the output width in pixels.
- **Sensible defaults:** Width 1200 px and max size 400 KB unless you say otherwise.
- **Clear errors:** Helpful error messages when something goes wrong.
- **TypeScript:** Written in strict TypeScript and ESM.

## Getting Started

### Prerequisites

**Node.js** version 24.12.0 or later (see `engines` in `package.json`) and **Git**.

### Installation

```bash
npm install <package-name-or-github-url>
```

OptiPic uses [sharp](https://sharp.pixelplumbing.com) for image processing. It is installed automatically as a dependency.

### Run the test app

The repository includes a test app (`test-app/app.ts`) that uses the module. Put JPEG images in `test-app/input`, then run:

```bash
npm start
```

Compressed images are written to `output/`.

## Usage

```typescript
import { OptiPic } from 'optipic'

// Create instance
const optiPic = new OptiPic()

// OptiPic can also be instantiated using options to use custom default width, max size and variants widths 
const optiPic = new OptiPic({ width: 800, maxSizeKB = 600, [200, 400, 600] })

// Load from a file path or a URL
await optiPic.load('./photos/holiday.jpg')

// Read metadata about the loaded image
const { format, width, height, size } = optiPic.getMetadata()

// Compress with the defaults (width 1200 px, max 400 KB) and save to ./output
await optiPic.compressToFile()

// Compress can be used with custom settings for width, size and output name
await optiPic.compressToFile({ width: 800, maxSizeKB: 150, outputName: 'holiday-small' })

// Get the compressed image as a Buffer instead of saving a file
const buffer = await optiPic.compressToBuffer({ width: 800, maxSizeKB: 150 })

// Compress variants with three different widths (480, 768, 1280) and save to ./output
await optiPic.compressVariantsToFiles()

// compressVariantsToFiles can be used with custom settings for widths, sizes and output names. Any left out property will fall back to default
await optiPic.compressVariantsToFiles([{ width: 200, maxSizeKB: 60, outputName: 'holiday-small' }, { width: 400, maxSizeKB: 120, outputName: 'holiday-medium' }])

// Compress variants with three different widths (480, 768, 1280) and return them as buffers
await optiPic.compressVariantsToBuffers()

// compressVariantsToBuffers can be used with custom settings for widths and sizes (output name is ignored). Any left out property will fall back to default
await optiPic.compressVariantsToBuffers([{ width: 200, maxSizeKB: 60 }, { width: 400, maxSizeKB: 120 }])
```

The compressed files are saved like so: `output/holiday-small.jpg`, in the folder your program runs from.

## API

### `new OptiPic()`

Creates a new instance. Each instance holds one loaded image at a time.

### `load(source: string): Promise<void>`

Loads an image from a file path or a URL. The source must end in `.jpg` or `.jpeg`. Loading a new image replaces the previous one.

### `getMetadata(): ImageMetadata`

Returns a copy of the loaded image's metadata:

| Property | Type     | Description                     |
| -------- | -------- | ------------------------------- |
| `format` | `string` | Image format, for example `jpeg` |
| `width`  | `number` | Width in pixels                 |
| `height` | `number` | Height in pixels                |
| `size`   | `number` | File size in bytes              |

### `compressToFile(options?): Promise<void>`

Resizes and compresses the loaded image, then saves it to `output/`.

| Option       | Type     | Default              | Description                                                                 |
| ------------ | -------- | -------------------- | --------------------------------------------------------------------------- |
| `width`      | `number` | `1200`               | Output width in pixels.                                                     |
| `maxSizeKB`  | `number` | `400`                | Maximum file size in KB.                                                    |
| `outputName` | `string` | generated            | File name without extension. If omitted, a name like `a1b2c3-w1200` is generated. |


### `compressToBuffer(options?): Promise<Buffer>`

Resizes and compresses the loaded image and returns it as Buffer data.

| Option       | Type     | Default              | Description                                                                 |
| ------------ | -------- | -------------------- | --------------------------------------------------------------------------- |
| `width`      | `number` | `1200`               | Output width in pixels.                                                     |
| `maxSizeKB`  | `number` | `400`                | Maximum file size in KB.                                                    |

OptiPic starts at JPEG quality 80 and lowers it in steps until the image is small enough, down to a minimum quality of 24.

### `compressVariantsToFiles(variants[]?): Promise<void>`

Resizes and compresses the loaded image into multiple variants with different widths and saves them. Default widths are set to three sizes: `[480, 768, 1280]`.

| Option       | Type     | Default              | Description                                                                 |
| ------------ | -------- | -------------------- | --------------------------------------------------------------------------- |
| `width`      | `number` | `[480, 768, 1280]`, variants > 3  `1200`               | Output width in pixels.                                                     |
| `maxSizeKB`  | `number` | `400`                | Maximum file size in KB.                                                    |

If more than three variants are passed without width defined the default width of 1200 are used for these.

### `compressVariantsToBuffers(variants[]?): Promise<Buffer[]>`

Resizes and compresses the loaded image into multiple variants with different widths returns them in order as a buffers. Default widths are set to three sizes: `[480, 768, 1280]`.

| Option       | Type     | Default              | Description                                                                 |
| ------------ | -------- | -------------------- | --------------------------------------------------------------------------- |
| `width`      | `number` | `[480, 768, 1280]`, variants > 3  `1200`               | Output width in pixels.                                                     |
| `maxSizeKB`  | `number` | `400`                | Maximum file size in KB.                                                    |

If more than three variants are passed without width defined the default width of 1200 are used for these.

### *DEPRECATED* `compress()`

This method will be removed in next major version. Please use `compressToFile()` instead.

## Error handling

`load`, `getMetadata`, `compress` and `compressToBuffer` throws an `Error` in these cases:

| Situation                                        | When                                   |
| ------------------------------------------------ | -------------------------------------- |
| `The image must be in jpg/jpeg format`           | `load` with a non-JPEG source          |
| `Could not load image: <status>`                 | `load` and the URL request failed      |
| `No image has been loaded`                       | `getMetadata` or `compress` before `load` |
| `Could not reach target file size...`            | `compress` cannot reach `maxSizeKB`. Increase `maxSizeKB` or use a smaller `width`. |

## Development

Scripts for working on the module itself:

| Command              | Description                                   |
| -------------------- | --------------------------------------------- |
| `npm start`          | Run the test app with `tsx`                   |
| `npm run build`      | Compile `src/` to `dist/`                     |
| `npm run typecheck`  | Type check without emitting files             |
| `npm test`           | Run unit tests in watch mode ([Vitest](https://vitest.dev)) |
| `npm run test:run`   | Run unit tests once                           |
| `npm run test:coverage`   | Overview of test coverage    |
| `npm run lint`       | Lint the source with [ESLint](https://eslint.org) |
| `npm run lint:fix`   | Fix fixable lint issues                       |
| `npm run format`     | Format files with [Prettier](https://prettier.io) |

## Testing

To run the modules automated unit tests you can use fhe following commands:

| Command                   | Description                  |
| --------------------------| ---------------------------- |
| `npm test`                | Run unit tests in watch mode |
| `npm run test:run`        | Run unit tests once          |

The following tests are included:

| Test              | Description                                   | Notes |
| -------------------- | --------------------------------------------- | ------------- |
| `OptiPic.test.ts`    | Tests of the main module class and its public methods | - Uses a third-party URL as an external dependency. If the test fails this URL might need to be updated. It's declared in the global variables `SAMPLE_URL`. Some of the test takes a few seconds to complete, so please be patient. |
| `SourceValidator.test.ts` | Tests of exported functions | None |


### Test app
The module also has a test app that creates an instance of the module and call its public methods.
- Run `npm start` to see a demo of the module in your console.
- The compressed images will be saved to a folder `output` in the project root.

### Results
Test results are described in [TEST_REPORT.md](./TEST_REPORT.md).

## Project Structure

```text
├── src/
│   ├── index.ts                # Module entry point
│   ├── OptiPic.ts              # Public class
│   ├── SourceValidator.ts      # Source format and URL checks
│   ├── ImageCompressor.ts      # Compression loop
│   ├── ImageValidator.test.ts  # Unit tests
│   └── OptiPic.test.ts         # Unit tests
├── test-app/                   # Test app for the module
│   ├── app.ts
│   └── input/                  # Images to compress
├── dist/                       # Compiled output (git-ignored, generated by `npm run build`)
├── tsconfig.json               # TypeScript config (strict mode)
├── tsconfig.build.json         # Build-only config
├── package.json                # Scripts and dependencies
├── TEST_REPORT.md              # Test report
└── LICENSE                     # Unlicense (public domain)
```

## License & Author

This project was created by Lowe Smed during the course Introduction to software quality (1DV610) as part of the program Web Development Programme at Linneuniversitetet 2026 and is released into the public domain under the [**Unlicense**](https://unlicense.org). You are free to copy, modify, publish, and distribute this boilerplate code in any way you see fit without any restrictions.
