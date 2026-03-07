#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BIN_DIR="$SCRIPT_DIR/../bin"
OS="$(uname -s)"
ARCH="$(uname -m)"

mkdir -p "$BIN_DIR"

# ---------------------------------------------------------------------------
# yt-dlp
# ---------------------------------------------------------------------------

install_ytdlp() {
  local binary="$BIN_DIR/yt-dlp"

  if [ -f "$binary" ] && [ -x "$binary" ]; then
    echo "yt-dlp: already present ($("$binary" --version))"
    return 0
  fi

  if [ "$OS" != "Linux" ]; then
    echo "yt-dlp: skipping download on $OS — install via your system package manager and ensure it is on PATH."
    return 0
  fi

  local asset
  case "$ARCH" in
    x86_64)  asset="yt-dlp_linux" ;;
    aarch64) asset="yt-dlp_linux_aarch64" ;;
    armv7l)  asset="yt-dlp_linux_armv7l" ;;
    *)
      echo "yt-dlp: unsupported architecture $ARCH" >&2
      return 1
      ;;
  esac

  echo "yt-dlp: downloading $asset..."
  curl -fsSL \
    "https://github.com/yt-dlp/yt-dlp/releases/latest/download/${asset}" \
    -o "$binary"
  chmod +x "$binary"
  echo "yt-dlp: installed $("$binary" --version)"
}

# ---------------------------------------------------------------------------
# ffmpeg
# ---------------------------------------------------------------------------

install_ffmpeg() {
  local binary="$BIN_DIR/ffmpeg"

  if [ -f "$binary" ] && [ -x "$binary" ]; then
    echo "ffmpeg: already present ($("$binary" -version 2>&1 | head -1))"
    return 0
  fi

  if [ "$OS" != "Linux" ]; then
    echo "ffmpeg: skipping download on $OS — install via your system package manager and ensure it is on PATH."
    return 0
  fi

  local archive
  case "$ARCH" in
    x86_64)  archive="ffmpeg-master-latest-linux64-gpl.tar.xz" ;;
    aarch64) archive="ffmpeg-master-latest-linuxarm64-gpl.tar.xz" ;;
    *)
      echo "ffmpeg: no static build for $ARCH — install manually and ensure it is on PATH."
      return 0
      ;;
  esac

  echo "ffmpeg: downloading $archive..."
  local tmp_dir=""
  tmp_dir="$(mktemp -d)"

  curl -fsSL \
    "https://github.com/BtbN/ffmpeg-builds/releases/download/latest/${archive}" \
    | tar -xJ -C "$tmp_dir"

  local ffmpeg_bin
  ffmpeg_bin="$(find "$tmp_dir" -type f -name "ffmpeg" | head -1)"

  if [ -z "$ffmpeg_bin" ]; then
    rm -rf "$tmp_dir"
    echo "ffmpeg: binary not found inside archive" >&2
    return 1
  fi

  cp "$ffmpeg_bin" "$binary"
  chmod +x "$binary"
  rm -rf "$tmp_dir"
  echo "ffmpeg: installed ($("$binary" -version 2>&1 | head -1))"
}

install_ytdlp
install_ffmpeg