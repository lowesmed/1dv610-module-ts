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
- Saves the result to an `output` folder, with a chosen or automatically generated file name.

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

const optiPic = new OptiPic()

// Load from a file path or a URL
await optiPic.load('./photos/holiday.jpg')

// Read metadata about the loaded image
const { format, width, height, size } = optiPic.getMetadata()

// Compress with the defaults (width 1200 px, max 400 KB)
await optiPic.compress()

// Or choose your own settings
await optiPic.compress({ width: 800, maxSizeKB: 150, outputName: 'holiday-small' })
```

The compressed file is saved as `output/holiday-small.jpg`, in the folder your program runs from.

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

### `compress(options?): Promise<void>`

Resizes and compresses the loaded image, then saves it to `output/`.

| Option       | Type     | Default              | Description                                                                 |
| ------------ | -------- | -------------------- | --------------------------------------------------------------------------- |
| `width`      | `number` | `1200`               | Output width in pixels.                                                     |
| `maxSizeKB`  | `number` | `400`                | Maximum file size in KB.                                                    |
| `outputName` | `string` | generated            | File name without extension. If omitted, a name like `a1b2c3-w1200` is generated. |

OptiPic starts at JPEG quality 80 and lowers it in steps until the image is small enough, down to a minimum quality of 24.

## Error handling

`load`, `getMetadata` and `compress` throw an `Error` in these cases:

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
| `npm run lint`       | Lint the source with [ESLint](https://eslint.org) |
| `npm run lint:fix`   | Fix fixable lint issues                       |
| `npm run format`     | Format files with [Prettier](https://prettier.io) |

Test results are described in [TEST_REPORT.md](./TEST_REPORT.md).

## Project Structure

```text
├── src/
│   ├── index.ts              # Module entry point
│   ├── OptiPic.ts            # Public class
│   ├── SourceValidator.ts    # Source format and URL checks
│   ├── ImageCompressor.ts    # Compression loop
│   └── OptiPic.test.ts       # Unit tests
├── test-app/                 # Test app for the module
│   ├── app.ts
│   └── input/                # Images to compress
├── dist/                     # Compiled output (git-ignored, generated by `npm run build`)
├── tsconfig.json             # TypeScript config (strict mode)
├── tsconfig.build.json       # Build-only config
├── package.json              # Scripts and dependencies
├── TEST_REPORT.md            # Test report
└── LICENSE                   # Unlicense (public domain)
```

## License & Author

This project was created by Lowe Smed during the course Introduction to software quality (1DV610) as part of the program Web Development Programme at Linneuniversitetet 2026 and is released into the public domain under the [**Unlicense**](https://unlicense.org). You are free to copy, modify, publish, and distribute this boilerplate code in any way you see fit without any restrictions.
