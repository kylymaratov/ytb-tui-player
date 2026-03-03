# ytb-tui-music

A terminal-based YouTube audio player built with Node.js and [blessed](https://github.com/chjj/blessed) for a rich TUI experience. It allows searching for YouTube tracks, managing playlists and favorites, and controlling playback directly from the terminal.

## Features

- Search YouTube for tracks
- Play audio via `mpv`
- Navigate playlists with keyboard arrows
- Pause/resume, next/previous controls
- Add/remove favorites and playlist entries
- Simple UI layout with now playing, search results, and help

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kylyamratov/ytb-tui-music.git
   cd ytb-tui-music
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Ensure `mpv` is installed** (required for playback):
   ```bash
   # Debian/Ubuntu
   sudo apt install mpv

   # macOS (Homebrew)
   brew install mpv
   ```

4. **Run the application**
   ```bash
   npm start
   ```

## Usage

- Use **↑/↓** to navigate song list
- **Enter** to play track
- **Space** to pause/resume
- **Shift + S** to open search screen
- **Shift + F** to open favorites
- **Shift + L** to add current track to favorites
- **Shift + N/P** for next/previous track
- **Shift + P** to add to playlist
- **Shift + D** to delete from playlist or favorites
- **Shift + H** to hide the info box
- **q** to exit

The interface displays current track information and helpful controls on the right panel.

## Project Structure

```
src/
  app.ts           # Application entry point
  index.ts         # Initialization and IPC
  components/      # TUI components built with blessed
  lib/             # Helper modules (database, mpv player, youtube search, etc.)
  logic/           # Main application logic
  types/           # Type definitions
  utils/           # Utility functions
```

`db.json` stores playlist and favorite data.

## Building an Executable

You can package the application as a standalone binary using [pkg](https://www.npmjs.com/package/pkg) or a similar bundler.

1. **Compile TypeScript** (if you haven't already):
   ```bash
   npm run build
   ```

2. **Install pkg globally** (or run via `npx`):
   ```bash
   npm install -g pkg
   # or
   npx pkg --version
   ```

3. **Create the executable**
   ```bash
   # example for Linux x64 and Node 18
   pkg . --targets node18-linux-x64 --output ytb-tui-player
   ```

   You can substitute other targets like `node18-win-x64` or `node18-macos-x64` depending on your platform.

4. **Distribute the binary**
   - Copy the resulting `ytb-tui-player` file to any machine with a compatible OS and architecture.
   - Make sure `mpv` is installed on the host system as it is still required at runtime.

> ⚠️ **Note:** pkg bundles your code and Node.js runtime, but native modules or external binaries (like `mpv`) are not included. End users must install `mpv` separately.

## License

[MIT](LICENSE)
