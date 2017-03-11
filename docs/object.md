# Object Reference

## UserObject

```javascript
{
  id:       String,                      // A user id should be 4-20 characters using only A-Z, a-z, 0-9, or _.
  password: String                       // A hashed user password
  name:     String
}
```

## DocumentObject

```javascript
{
  id:            Number,
  historyId:     UUID,                  // The archived document and its new version share the same historyId
  isArchived:    Boolean,
  author:        UserObject,
  title:         String,
  content:       String,                // The raw Kotodown content
  parsedContent: String,                // The content converted to HTML
  tags:          Array<TagObject>,
  comments:      Array<CommentObject>,
  createdAt:     Date
}
```

## FileObject

```javascript
{
  id:            Number,
  historyId:     UUID,                  // The archived document and its new version share the same historyId
  isArchived:    Boolean,
  author:        UserObject,
  filename:      String,
  content:       String,                // The raw Kotodown content
  parsedContent: String,                // The content converted to HTML
  tags:          Array<TagObject>,
  comments:      Array<CommentObject>,
  createdAt:     Date
}
```

## TagObject

```javascript
{
  id:    Number,
  title: String,
  count: Number,
  color: String
}
```

## CommentObject

```javascript
{
  id:         Number,
  documentId: Number,
  author:     UserObject,
  content:    String,
  range:      RangeObject,              // The position of the comment in the document
  createdAt:  Date
}
```

## RangeObject

```javascript
{
  start: Number,
  end:   Number
}
```

## BlockDiffObject

```javascript
{
  removed: Boolean,                        // Set true when the value has been removed
  added:   Boolean,                        // Set true when the value has been added
  value:   String | Array<WordDiffObject>  // A plain String value when no change made
                                           // A removed or added String value in either case
}                                          // A detailed word-diff result when both removed and added
```

## WordDiffObject

```javascript
{
  removed: Boolean,                        // Set true when the value has been removed
  added:   Boolean,                        // Set true when the value has been added
  value:   String                          // A modified or kept value
}
```

## ErrorObject

```javascript
{
  name:    String,
  message: String,
  stack:   String                       // A recent call stack until the error got thrown
}
```