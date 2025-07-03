module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        "babel-preset-expo",
        {
          "react-compiler": {
            sources: (filename) => {
              // Match file names to include in the React Compiler.
              // Include all files in your app directory and components
              return (
                filename.includes("app/") ||
                filename.includes("components/") ||
                filename.includes("screens/")
              );
            },
          },
        },
      ],
    ],
  };
};
