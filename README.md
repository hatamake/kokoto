# kokoto

*Kokoto* is a brand-new platform for efficient and flexible collaboration.

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

- config.secret: A secret key phrase for encrypting sessions (Default: A random 44-length String)
- config.db: MongoDB connection URI used for connecting to the database (Default: `'mongodb://127.0.0.1/kokoto'`)
- config.session: A cookie field name for storing session ID (Default: `'session'`)
- options.pagination: A count of items displayed in each page (Default: `20`)
- options.listen: An argument *or* an array of arguments passed to [http.Server.listen()](https://nodejs.org/api/http.html#http_server_listen_path_callback). (Default: `8080`)

## License

See [LICENSE](/LICENSE) for license details including full list of dependencies.