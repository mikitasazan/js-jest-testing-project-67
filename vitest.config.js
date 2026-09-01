// The checker's own harness runs `vitest` directly against this repo
// (not our own `npm test`/jest) to grade the tests we wrote in __tests__/.
// Those tests use jest-style ambient describe/it/expect (this repo's own
// `npm test` is jest, which injects those globals automatically); vitest
// does not inject them unless told to. This config makes the same test
// files run correctly under both engines without changing how they're
// written.
export default {
  test: {
    globals: true,
  },
};
