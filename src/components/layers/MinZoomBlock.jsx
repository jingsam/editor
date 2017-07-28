import React from 'react'

import GlSpec from '../../config/v8.json'
import InputBlock from '../inputs/InputBlock'
import NumberInput from '../inputs/NumberInput'

class MinZoomBlock extends React.Component {
  static propTypes = {
    value: React.PropTypes.number.isRequired,
    onChange: React.PropTypes.func.isRequired,
  }

  render() {
    return <InputBlock label={"最小缩放级别"} doc={GlSpec.layer.minzoom.doc}>
      <NumberInput
        value={this.props.value}
        onChange={this.props.onChange}
        min={GlSpec.layer.minzoom.minimum}
        max={GlSpec.layer.minzoom.maximum}
        default={GlSpec.layer.minzoom.minimum}
      />
    </InputBlock>
  }
}

export default MinZoomBlock
