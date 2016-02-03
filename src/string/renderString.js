import {isText, isThunk, isEmpty} from '../element'
import isValidAttribute from '@f/is-valid-attr'

/**
 * Turn an object of key/value pairs into a HTML attribute string. This
 * function is responsible for what attributes are allowed to be rendered and
 * should handle any other special cases specific to deku.
 */

function attributesToString (attributes) {
  var str = ''
  for (var name in attributes) {
    let value = attributes[name]
    if (name === 'innerHTML') continue
    if (isValidAttribute(value)) str += (' ' + name + '="' + attributes[name] + '"')
  }
  return str
}

/**
 * Render a virtual element to a string. You can pass in an option state context
 * object that will be given to all components.
 */

export function renderString (element, context, path = '0') {
  if (isText(element)) {
    return element.nodeValue
  }

  if (isEmpty(element)) {
    return '<noscript></noscript>'
  }

  if (isThunk(element)) {
    let { props, component, children } = element
    let { render } = component
    let output = render({
      children,
      props,
      path,
      context
    })
    return renderString(
      output,
      context,
      path
    )
  }

  let {attributes, type, children} = element
  let innerHTML = attributes.innerHTML
  let str = '<' + type + attributesToString(attributes) + '>'

  if (innerHTML) {
    str += innerHTML
  } else {
    str += children.map((child, i) => renderString(child, context, path + '.' + (child.key == null ? i : child.key))).join('')
  }

  str += '</' + type + '>'
  return str
}
