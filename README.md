# kokoto

*Kokoto* is a platform for an efficient and flexible collaboration.

## Features

Check out our introduction [video](https://youtu.be/8T_3CCvF3Jo) and [paper](http://www.slideshare.net/secret/xvrZLso2IOMf3w).

- Beautiful theme 
- Tag classification & search
- Inline-comment
- History archiving
- Extensible editor
- ...

## Installation

```bash
git clone https://github.com/hatamake/kokoto.git
cd kokoto/
npm install
```

## Usage

```bash
npm start
```

### Configuration

Configuration is loaded from the exported object of `config.js`. Following options are configurable.

 Key                       | Default                           | Description
---------------------------|-----------------------------------|-------------
 [config.secret]           | A random string of 44 chars       | A key phrase for encrypting sessions
 [config.session]          | `'session'`                       | A cookie field name for storing session ID
 [config.database.persist] | `'mysql://127.0.0.1:3306/kokoto'` | A full database URI *or* an array of arguments passed to the [Sequelize constructor](http://sequelize.readthedocs.io/en/latest/api/sequelize/#class-sequelize)
 [config.database.cache]   | `null`                            | The URL of the Redis server *or* an array of arguments passed to [`redis.createServer()`](https://github.com/NodeRedis/node_redis#rediscreateclient). To disable the cache server, use `null`.
 [config.site.name]        | `'Kokoto'`                        | The name of the site
 [config.site.pagination]  | `20`                              | A count of items displayed in each page
 config.listen             |                                   | An argument *or* an array of arguments passed to [http.Server.listen()](https://nodejs.org/api/http.html#http_server_listen_path_callback)

## License

Kokoto is licensed under the MIT License.
See [LICENSE](/LICENSE) and [NOTICE](/NOTICE) for full license text.

```
MIT License

Copyright (c) 2017 cumul <gg6123@naver.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```