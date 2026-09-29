import Axios from "../../../lib/core/Axios.js";
import assert from "assert";

describe('Axios', function () {
  describe('getUri', function () {
    it('should apply a function-valued paramsSerializer', function () {
      const axios = new Axios({});
      const uri = axios.getUri({
        url: '/search',
        params: {q: 'hello'},
        paramsSerializer: () => 'custom=yes'
      });
      assert.strictEqual(uri, '/search?custom=yes');
    });

    it('should apply a function paramsSerializer from defaults', function () {
      const axios = new Axios({
        paramsSerializer: () => 'from=defaults'
      });
      assert.strictEqual(
        axios.getUri({url: '/search', params: {q: 'hello'}}),
        '/search?from=defaults'
      );
    });

    it('should apply an object-form paramsSerializer', function () {
      const axios = new Axios({});
      const uri = axios.getUri({
        url: '/search',
        params: {q: 'hello'},
        paramsSerializer: {
          serialize: () => 'object=form'
        }
      });
      assert.strictEqual(uri, '/search?object=form');
    });

    it('should allow constructing without a config argument', function () {
      const axios = new Axios();
      assert.strictEqual(axios.getUri({url: '/ping'}), '/ping');
    });
  });

  describe("handle un-writable error stack", function () {
    async function testUnwritableErrorStack(stackAttributes) {
      const axios = new Axios({});
      // mock axios._request to return an Error with an un-writable stack property
      axios._request = () => {
        const mockError = new Error("test-error");
        Object.defineProperty(mockError, "stack", stackAttributes);
        throw mockError;
      }
      try {
        await axios.request("test-url", {})
      } catch (e) {
        assert.strictEqual(e.message, "test-error")
      }
    }

    it('should support errors with a defined but un-writable stack', async function () {
      await testUnwritableErrorStack({value: {}, writable: false})
    });

    it('should support errors with an undefined and un-writable stack', async function () {
      await testUnwritableErrorStack({value: undefined, writable: false})
    });

    it('should support errors with a custom getter/setter for the stack property', async function () {
      await testUnwritableErrorStack({
        get: () => ({}),
        set: () => {
          throw new Error('read-only');
        }
      })
    });

    it('should support errors with a custom getter/setter for the stack property (null case)', async function () {
      await testUnwritableErrorStack({
        get: () => null,
        set: () => {
          throw new Error('read-only');
        }
      })
    });
  })
});
