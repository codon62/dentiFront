// module.exports = {
//   presets: ['@vue/cli-plugin-babel/preset'],
// };
// module.exports = {
//   presets: [
//     [
//       '@vue/app',
//       {
//         polyfills: ['es.array.iterator', 'es.promise'],
//       },
//     ],
//   ],
// };
module.exports = {
  presets: [['@vue/cli-plugin-babel/preset', { useBuiltIns: 'entry', corejs: { version: 3, proposals: true } }]],
};
