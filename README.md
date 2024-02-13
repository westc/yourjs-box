# JSBox

A simple way to embed a JavaScript console on your website.

## Continued Development of LupaJS

### Set Up for Development

Install of the development dependencies by running `npm install`.

### Generate Dist Files

Execute `npm start` to run gulp and then edit one of the three files in `src/`.

## Roadmap

- Open button - Load a JS file from the filesystem.
- Save button - Save the current inputs as a JS file that can be opened later.
- Add `@timeout` annotation to the special comments that will allow you to input the amount of seconds to wait since the last call to a console logging function before automatically running the next comment segmented block.
- Allow for TypeScript
- Allow for CoffeeScript
- Allow code to run in main window.
