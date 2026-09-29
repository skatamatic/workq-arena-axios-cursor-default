import assert from 'assert';
import axios from '../../../index.js';
import Axios from '../../../lib/core/Axios.js';

describe('getUri regressions', function () {
  it('should honor a function-valued paramsSerializer', function () {
    const uri = axios.getUri({
      url: '/search',
      params: {q: 'hello'},
      paramsSerializer: () => 'custom=yes'
    });

    assert.strictEqual(uri, '/search?custom=yes');
  });

  it('should allow constructing Axios without a config argument', function () {
    const instance = new Axios();

    assert.deepStrictEqual(instance.defaults, {});
    assert.strictEqual(instance.getUri({url: '/ping'}), '/ping');
  });

  it('should preserve object-form paramsSerializer and default serialization', function () {
    assert.strictEqual(
      axios.getUri({
        url: '/search',
        params: {q: 'hello'},
        paramsSerializer: {
          serialize: () => 'custom=yes'
        }
      }),
      '/search?custom=yes'
    );

    assert.strictEqual(
      axios.getUri({
        url: '/search',
        params: {q: 'hello'}
      }),
      '/search?q=hello'
    );
  });

  it('should preserve explicit constructor configuration', function () {
    const instance = new Axios({
      baseURL: 'https://api.example.com',
      params: {token: 'abc'}
    });

    assert.strictEqual(
      instance.getUri({url: '/ping', params: {q: '1'}}),
      'https://api.example.com/ping?token=abc&q=1'
    );
  });
});
