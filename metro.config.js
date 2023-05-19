// module.exports = {
//   transformer: {
//     assetPlugins: ['expo-asset/tools/hashAssetFiles'],
//   },
// };
module.exports = {
    transformer: {
        getTransformOptions: async () => ({
            transform: {
                experimentalImportSupport: true,
                inlineRequires: true,
            },
        }),
    },
};