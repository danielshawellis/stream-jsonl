# stream-jsonl

A **zero-dependency**, TypeScript-first library for streaming very large JSONL (newline-delimited JSON) or gzipped JSONL files over HTTP with a minimal memory footprint and robust error recovery.

- **Low memory usage**: Processes line-by-line without buffering the full file.
- **Resumable downloads**: HTTP `Range` support to resume exactly where you left off after a network failure.
- **Automatic retries**: Exponential backoff retries on transient errors, with configurable time and delay limits.
- **Gzip-handling**: Out-of-the-box support for gzipped JSONL streams.
- **Embedded restart metadata**: Errors carry precise byte/line locations (`FileLocation`) to restart your processing.
- **Zero dependencies**: Leverages only built-in Node.js APIs (streams, zlib, native fetch).

---

## 🚀 Quick Start

### Installation

Requires **Node.js 18+** for native `fetch` and streaming APIs. Not suitable for browser environments.

```bash
npm install stream-jsonl
```

### Basic Usage

```ts
import { streamJsonl, FileLocation, JsonlStreamError } from 'stream-jsonl';

async function run() {
  try {
    const url = 'https://example.com/data.jsonl.gz';
    // Optional: resume from a previous failure
    const startingLocation: FileLocation = { byteOffset: 0, line: 0 };

    for await (const { value, location } of streamJsonl({ url, startingLocation })) {
      console.log('Parsed:', value);
      // You can log or persist `location` to resume later
    }

    console.log('Streaming complete!');
  } catch (err) {
    if (err instanceof JsonlStreamError) {
      console.error(`Stream failed at byte ${err.location.byteOffset}, line ${err.location.line}`);
      console.error('Cause:', err.cause);
      // Restart using err.location
    } else {
      throw err;
    }
  }
}

run();
```

---

## 📚 API

### `streamJsonl(options)`

Returns an `AsyncGenerator<{ value: unknown; location: FileLocation }>`, yielding each JSON object and its file location.

| Option                | Type                       | Default      | Description                                                  |
|-----------------------|----------------------------|--------------|--------------------------------------------------------------|
| `url`                 | `string`                   | _required_   | Remote HTTP URL of the JSONL or JSONL.gz file                |
| `startingLocation?`   | `FileLocation`             | `undefined`  | Byte/line to resume from; triggers a HEAD-range check        |
| `initialDelayMs?`     | `number`                   | `1000`       | Initial backoff delay in milliseconds                        |
| `maxRetryTimeMs?`     | `number`                   | `3600000`    | Total retry window before giving up (ms)                     |
| `maxDelayMs?`         | `number`                   | `30000`      | Maximum single retry delay (ms)                              |


### `FileLocation`

```ts
interface FileLocation {
  byteOffset: number;  // Byte index to resume from
  line: number;        // 1-based line number to resume from
}
```

### `JsonlStreamError`

Extends built-in `Error` and includes:
- `.location: FileLocation` – where the error occurred
- `.cause?: Error` – underlying network or parse error

---

## 🛠️ Configuration

- **Zero external dependencies**: All functionality uses Node.js core modules (no npm installs required beyond this package).
- **ESM only**: Distributed as pure ES modules; Node.js 18+ compatible.

---

## 🧪 Testing

This library uses [Vitest](https://vitest.dev/) for unit tests with fake timers for fast backoff simulations.

```bash
npm test
```

---

## 📦 Build & Release

```bash
npm run build    # bundles ESM + CJS + declaration files via tsup
npm publish      # publishes to npm (requires NPM_TOKEN)
```

---

Feel free to open issues or pull requests on [GitHub](https://github.com/danielshawellis/stream-jsonl).

