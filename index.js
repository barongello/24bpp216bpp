const imagePixels = require("image-pixels");
const fs = require("fs");

async function convert(image, converted) {
  const { data, width, height } = await imagePixels(image);
  const pixels = width * height;
  const arr = [];

  for(i = 0; i < pixels; ++i) {
    const r = data[i * 4 + 0];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];

    let n = 0;

    n |= (r & 0xF8) << 8; // Upper 5 bits of red
    n |= (g & 0xFC) << 3; // Upper 6 bits of green
    n |= (b & 0xF8) >> 3; // Upper 5 bits of blue

    const color_hi = (n & 0xFF00) >> 8;
    const color_lo = (n & 0xFF);

    const hi = `0x${color_hi.toString(16).padStart(2, "0").toUpperCase()}`;
    const lo = `0x${color_lo.toString(16).padStart(2, "0").toUpperCase()}`;

    arr.push(hi);
    arr.push(lo);
  }

  const content = JSON.stringify(arr)
    .replace(/\"/g, "")
    .replace(/\[/g, "[\n")
    .replace(/(0x..,0x..,0x..,0x..,0x..,0x..,0x..,0x..,0x..,0x..,?)/g, "  $1\n")
    .replace(/,0/g, ", 0");

  fs.writeFileSync(converted, content);
}

convert("input.bmp", "output.txt");
