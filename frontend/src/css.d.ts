// react-scripts only declares "*.module.css"; plain side-effect CSS imports
// are unresolved, which TypeScript 6+ reports as TS2882.
declare module "*.css";
