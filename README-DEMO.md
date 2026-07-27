# Demo Startup Guide

## Recommended startup on Windows

Double click:

```txt
start-demo.bat
```

The script will:

1. Check Node.js and npm
2. Install dependencies automatically
3. Start the local Vite server
4. Open the browser automatically

URL:

```txt
http://127.0.0.1:5173/service-hall
```

## Requirements

- Node.js 18 or newer
- Internet access for npm dependencies

## If dependency installation is slow or failed in China

Run this once in CMD, then double click `start-demo.bat` again:

```bat
npm config set registry https://registry.npmmirror.com
```

## Stop server

Close the startup window, or press `Ctrl + C`.
