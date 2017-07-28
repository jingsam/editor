import React from 'react'

import GlSpec from '../../config/v8.json'
import InputBlock from '../inputs/InputBlock'
import StringInput from '../inputs/StringInput'

class LayerIdBlock extends React.Component {
  static propTypes = {
    value: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func.isRequired,
  }

  render() {
    return <InputBlock label={"图层ID"} doc={GlSpec.layer.id.doc}>
      <StringInput
        value={this.props.value}
        onChange={this.props.onChange}
      />
    </InputBlock>
  }
}

export default LayerIdBlock
