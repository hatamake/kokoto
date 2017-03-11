# REST API Reference

## /site

### GET /site/:key

Fetches the value of `config.site` by its key.

### Request

   Key      | Default | Description  
  ----------|---------|--------------
   :key     |         | The key of the value

### Response

   Key      | Description
  ----------|-------------
   error    | [ErrorObject](object.md#errorobject)
   result   | The requested value

## /session

### PUT /session

Processes sign-in with the provided user information.

#### Request

   Key      | Default | Description  
  ----------|---------|--------------
   id       |         | The user id
   password |         | The user password

#### Response

   Key      | Description
  ----------|-------------
   error    | [ErrorObject](object.md#errorobject)
   user     | [UserObject](object.md#userobject) of the current session

### DELETE /session

Removes current session and sign out.

#### Response

   Key      | Description
  ----------|-------------
   error    | [ErrorObject](object.md#errorobject)

## /user

### POST /user

Creates a new user, and process sign-in with the new user.

#### Request

   Key      | Default | Description
  ----------|---------|--------------
   id       |         | The new user id
   password |         | The new user password
   name     |         | The new user name

#### Response

   Key      | Description
  ----------|-------------
   error    | [ErrorObject](object.md#errorobject)
   user     | [UserObject](object.md#userobject) of newly signed up user.

### GET /user/:id

Fetches the [UserObject](object.md#userobject) whose `user.id` is requested.

#### Request

   Key      | Default | Description
  ----------|---------|--------------
   :id      |         | Specify `user.id`, or *me* to fetch current user.

#### Response

   Key      | Description
  ----------|-------------
   error    | [ErrorObject](object.md#errorobject)
   user     | [UserObject](object.md#userobject)

### GET /user/:id/picture

Fetches the profile picture of the specified user.

#### Request

   Key      | Default | Description
  ----------|---------|--------------
   :id      |         | Specify `user.id`, or *me* to fetch current user's picture.

#### Response

   An `image/png` file stream.

### PUT /user/me

Updates user information of currently signed in user.

#### Request

   Key        | Default | Description
  ------------|---------|--------------
   [password] |         | The new password. Keep existing password, if omitted.
   [name]     |         | The new user name. Keep existing name, if omitted.
   [picture]  |         | The new profile picture. Keep existing picture, if omitted.

#### Response

   Key      | Description
  ----------|-------------
   error    | [ErrorObject](object.md#errorobject)
   user     | The [UserObject](object.md#userobject) of updated user.

### DELETE /user/me

Removes currently signed in user and destroys current session.

#### Response

   Key      | Description
  ----------|-------------
   error    | [ErrorObject](object.md#errorobject)

### GET /user/search

Fetches the list of the users containing requested text in its `user.id` or `user.name`.

#### Request

   Key      | Default | Description
  ----------|---------|--------------
   [?query] |         | The target text searched from `user.id` or `user.name`
   [?after] | `'\0'`  | The `user.id` of the last user in the previous search result. Used for pagination.

#### Response

   Key      | Description
  ----------|-------------
   error    | [ErrorObject](object.md#errorobject)
   tags     | The *array* of [UserObject](object.md#userobject)s

## /document

### GET /document/:id

Fetches the [DocumentObject](object.md#documentobject) whose `document.id` is requested.

#### Request

   Key      | Default | Description
  ----------|---------|--------------
   :id      |         | Specify `document.id`.

#### Response

   Key      | Description
  ----------|-------------
   error    | [ErrorObject](object.md#errorobject)
   document | [DocumentObject](object.md#documentobject)

### GET /document/:id/history

Fetches the change history of the [DocumentObject](object.md#documentobject) whose `document.id` is requested.

#### Request

   Key      | Default | Description
  ----------|---------|--------------
   :id      |         | Specify `document.id`.

#### Response

   Key       | Description
  -----------|-------------
   error     | [ErrorObject](object.md#errorobject)
   documents | An *array* of [DocumentObject](object.md#documentobject)s

### GET /document/:id/diff

Compare the two given documents' content and send the result.

#### Request

   Key      | Default | Description
  ----------|---------|--------------
   :id      |         | Specify `document.id` to compare from
   ?to      |         | Specify `document.id` to compare to

The document specified by `:id` is compared with `?to`.

#### Response

   Key      | Description
  ----------|-------------
   error    | [ErrorObject](object.md#errorobject)
   diff     | An *array* of [BlockDiffObject](object.md#blockdiffobject)

### POST /document

Creates a new document.

#### Request

   Key      | Default | Description
  ----------|---------|--------------
   title    |         | The title
   content  |         | The content in Kotodown
   tags     |         | The *array* of [TagObject](object.md#tagobject)s without `tag.id`

#### Response

   Key      | Description
  ----------|-------------
   error    | [ErrorObject](object.md#errorobject)
   document | [DocumentObject](object.md#documentobject)

### PUT /document/:id

Updates specified document.

#### Request

   Key       | Default | Description
  -----------|---------|--------------
   :id       |         | The `document.id` of the document getting updated
   historyId |         | The `document.historyId` of the document getting updated
   title     |         | The new title
   content   |         | The new content in Kotodown
   tags      |         | The new *array* of [TagObject](object.md#tagobject)s without `tag.id`

#### Response

   Key      | Description
  ----------|-------------
   error    | [ErrorObject](object.md#errorobject)
   document | The [DocumentObject](object.md#documentobject) after update

### DELETE /document/:id

Set specified document as archived.

#### Request

   Key      | Default | Description
  ----------|---------|--------------
   :id      |         | The `document.id` of the document getting removed

#### Response

   Key      | Description
  ----------|-------------
   error    | [ErrorObject](object.md#errorobject)

### GET /document/search

Fetch the list of the documents satisfying requested criteria.

#### Request

   Key      | Default  | Description
  ----------|----------|--------------
   [?type]  | `'date'` | The type of search criteria. Following types are available: `'date'`, `'history'`, `'tag'`, `'text'`
   [?query] |          | The value of `document.historyId`, `tag.id`, or plain text depending on the specified type
   [?after] | `-1`     | The `document.id` of the last document in the previous search result. Used for pagination.

#### Response

   Key       | Description
  -----------|-------------
   error     | [ErrorObject](object.md#errorobject)
   documents | The *array* of [DocumentObject](object.md#documentobject)s

### POST /document/:documentId/comment

Creates a new comment.

#### Request

   Key         | Default | Description
  -------------|---------|--------------
   :documentId |         | The `document.id` value of the document on which the new comment is added
   content     |         | The content of the new comment
   range       |         | The [RangeObject](object.md#rangeobject) specifying the position of the new comment in the document

#### Response

   Key      | Description
  ----------|-------------
   error    | [ErrorObject](object.md#errorobject)
   comment  | [CommentObject](object.md#commentobject)

### PUT /document/:documentId/comment/:commentId

Updates specified comment.

#### Request

   Key         | Default | Description
  -------------|---------|--------------
   :documentId |         | The `document.id` value of the document to which the comment is attached
   :commentId  |         | The `comment.id` value of the comment getting updated
   content     |         | The new content

#### Response

   Key      | Description
  ----------|-------------
   error    | [ErrorObject](object.md#errorobject)
   comment  | The [CommentObject](object.md#commentobject) after update

### DELETE /document/:documentId/comment/:commentId

Removes specified comment.

#### Request

   Key         | Default | Description
  -------------|---------|--------------
   :documentId |         | The `document.id` value of the document to which the comment is attached
   :commentId  |         | The `comment.id` value of the comment getting removed

#### Response

   Key      | Description
  ----------|-------------
   error    | [ErrorObject](object.md#errorobject)

## /file

### GET /file/:id

Fetches the [FileObject](object.md#fileobject) whose `file.id` is requested.

#### Request

   Key      | Default | Description
  ----------|---------|--------------
   :id      |         | Specify `file.id`.

#### Response

   Key      | Description
  ----------|-------------
   error    | [ErrorObject](object.md#errorobject)
   file     | [FileObject](object.md#fileobject)

### GET /file/:id/stream

Fetches the file stream of the specified file.

#### Request

   Key      | Default | Description
  ----------|---------|--------------
   :id      |         | Specify `file.id`.

#### Response

   The uploaded file stream.

### POST /file

Creates a new file.

#### Request

   Key      | Default | Description
  ----------|---------|--------------
   title    |         | The title
   content  |         | The content in Kotodown
   tags     |         | The *array* of [TagObject](object.md#tagobject)s without `tag.id`
   stream   |         | The file stream

#### Response

   Key      | Description
  ----------|-------------
   error    | [ErrorObject](object.md#errorobject)
   file     | [FileObject](object.md#fileobject)

### PUT /file/:id

Updates specified document.

#### Request

   Key       | Default | Description
  -----------|---------|--------------
   :id       |         | The `file.id` of the file getting updated
   historyId |         | The `file.historyId` of the file getting updated
   title     |         | The new title
   content   |         | The new content in Kotodown
   tags      |         | The new *array* of [TagObject](object.md#tagobject)s without `tag.id`
   stream    |         | The new file stream

#### Response

   Key      | Description
  ----------|-------------
   error    | [ErrorObject](object.md#errorobject)
   file     | The [FileObject](object.md#fileobject) after update

### DELETE /file/:id

Set specified file as archived.

#### Request

   Key      | Default | Description
  ----------|---------|--------------
   :id      |         | The `file.id` of the file getting removed

#### Response

   Key      | Description
  ----------|-------------
   error    | [ErrorObject](object.md#errorobject)

### GET /file/search

Fetch the list of the files satisfying requested criteria.

#### Request

   Key      | Default  | Description
  ----------|----------|--------------
   [?type]  | `'date'` | The type of search criteria. Following types are available: `'date'`, `'history'`, `'tag'`, `'text'`
   [?query] |          | The value of `file.historyId`, `tag.id`, or plain text depending on the specified type
   [?after] | `-1`     | The `file.id` of the last document in the previous search result. Used for pagination.

#### Response

   Key       | Description
  -----------|-------------
   error     | [ErrorObject](object.md#errorobject)
   files     | The *array* of [FileObject](object.md#fileobject)s

### POST /file/:fileId/comment

Creates a new comment.

#### Request

   Key     | Default | Description
  ---------|---------|--------------
   :fileId |         | The `file.id` value of the file on which the new comment is added
   content |         | The content of the new comment

#### Response

   Key      | Description
  ----------|-------------
   error    | [ErrorObject](object.md#errorobject)
   comment  | [CommentObject](object.md#commentobject)

### PUT /file/:fileId/comment/:commentId

Updates specified comment.

#### Request

   Key        | Default | Description
  ------------|---------|--------------
   :fileId    |         | The `file.id` value of the file to which the comment is attached
   :commentId |         | The `comment.id` value of the comment getting updated
   content    |         | The new content

#### Response

   Key      | Description
  ----------|-------------
   error    | [ErrorObject](object.md#errorobject)
   comment  | The [CommentObject](object.md#commentobject) after update

### DELETE /file/:fileId/comment/:commentId

Removes specified comment.

#### Request

   Key        | Default | Description
  ------------|---------|--------------
   :fileId    |         | The `file.id` value of the file to which the comment is attached
   :commentId |         | The `comment.id` value of the comment getting removed

#### Response

   Key      | Description
  ----------|-------------
   error    | [ErrorObject](object.md#errorobject)

## /tag

### PUT /tag/:id

Updates specified tag.

#### Request

   Key      | Default | Description
  ----------|---------|--------------
   :id      |         | The `tag.id` of the tag getting updated
   title    |         | The new title
   color    |         | The new color code

#### Response

   Key      | Description
  ----------|-------------
   error    | [ErrorObject](object.md#errorobject)
   tag      | The [TagObject](object.md#tagobject) after update

### DELETE /tag/:id

Removes specified tag.

#### Request

   Key      | Default | Description
  ----------|---------|--------------
   :id      |         | The `tag.id` value of the tag getting removed

#### Response

   Key      | Description
  ----------|-------------
   error    | [ErrorObject](object.md#errorobject)

### GET /tag/search

Fetches the list of the tags containing requested text in its title.

#### Request

   Key      | Default | Description
  ----------|---------|--------------
   [?query] |         | The target text searched from `tag.title`s
   [?after] | `-1`    | The `tag.id` of the last tag in the previous search result. Used for pagination.

#### Response

   Key      | Description
  ----------|-------------
   error    | [ErrorObject](object.md#errorobject)
   tags     | The *array* of [TagObject](object.md#tagobject)s