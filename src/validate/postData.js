const params = require('./params')
const { empty, emptyObject } = require('../aid')
const { InvalidArchiveError } = require('../error')

/*
 * mimeType: required string
 * params: optional array
 * text: optional string
 * comment: optional string
 *
 * max 1 nonempty params|text
 * structured data type application/x-www-form-urlencoded|multipart/form-data
 */
function postData (node, i, assay) {
  if (!emptyObject(node)) {
    validate(node, i)
    if (node.params) {
      params(node.params, i, assay)
    }
  }
}

function validate (node, i) {
  if (empty(node.mimeType)) {
    throw new InvalidArchiveError(
      { name: 'MissingPostDataType' },
      `Missing post data MIME type (${i})`
    )
  }
  if (typeof node.mimeType !== 'string') {
    throw new InvalidArchiveError(
      { name: 'InvalidPostDataType' },
      `Invalid post data MIME type (${i}): must be string`
    )
  }
  if (node.params && !Array.isArray(node.params)) {
    throw new InvalidArchiveError(
      { name: 'InvalidPostDataParams' },
      `Invalid post data params (${i}): must be array`
    )
  }
  if (node.text && typeof node.text !== 'string') {
    throw new InvalidArchiveError(
      { name: 'InvalidPostDataText' },
      `Invalid post data text (${i}): must be string`
    )
  }
  if (node.comment && typeof node.comment !== 'string') {
    throw new InvalidArchiveError(
      { name: 'InvalidComment' },
      `Invalid post data comment (${i}): must be string`
    )
  }
  if (node.params && node.params.length && node.text) {
    throw new InvalidArchiveError(
      { name: 'PostDataConflict' },
      `Post data conflict (${i}): specify 1 of params or text`
    )
  }
  if (
    node.params &&
    node.params.length &&
    ![
      'application/x-www-form-urlencoded',
      'multipart/form-data'
    ].includes(node.mimeType)
  ) {
    throw new InvalidArchiveError(
      { name: 'InvalidPostDataType' },
      `Invalid structured post data MIME type (${i}): ${node.mimeType}`
    )
  }
}

module.exports = postData
