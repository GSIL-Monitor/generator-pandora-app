import ReactDOM from 'react-dom'
import React from 'react'
import MountContainer from '@wac/wac-ui-mob/MountContainer'

export function updateTag (tagName, keyName, keyValue, attrName, attrValue) {
  const node = document.head.querySelector(`${tagName}[${keyName}="${keyValue}"]`)
  if (node && node.getAttribute(attrName) === attrValue) return

  // Remove and create a new tag in order to make it work with bookmarks in Safari
  if (node) {
    node.parentNode.removeChild(node)
  }
  if (typeof attrValue === 'string') {
    const nextNode = document.createElement(tagName)
    nextNode.setAttribute(keyName, keyValue)
    nextNode.setAttribute(attrName, attrValue)
    document.head.appendChild(nextNode)
  }
}

export function updateMeta (name, content) {
  updateTag('meta', 'name', name, 'content', content)
}

export function updateCustomMeta (property, content) {
  updateTag('meta', 'property', property, 'content', content)
}

export function updateLink (rel, href) {
  updateTag('link', 'rel', rel, 'href', href)
}

export const showModal = (containerId, props, WrappedComponent) => {
  let containerEl = document.querySelector(`#${containerId}`)
  if (!containerEl) {
    containerEl = document.createElement('div')
    containerEl.setAttribute('id', containerId)
    document.body.appendChild(containerEl)
  }

  ReactDOM.render(<MountContainer><WrappedComponent {...props} /></MountContainer>, containerEl)
}

export const removeModal = (containerId) => {
  let containerEl = document.querySelector(`#${containerId}`)
  if (containerEl) {
    containerEl.parentNode.removeChild(containerEl)
  }
}
