import React from 'react'
import { Button } from 'react-bootstrap';

export function TagRender (props) {
    let {tag, key, disabled, onRemove, classNameRemove, getTagDisplayValue, ...other} = props

    return (
      <Button variant="secondary" size="sm" key={key} {...other}>
        {getTagDisplayValue(tag)}
        {!disabled &&
          <a style={{ color: '#070C0A' }} className={classNameRemove} onClick={(e) => onRemove(key)}> x</a>
        }
      </Button>
    )
  }