import React from 'react'

import GlSpec from '../../config/v8.json'
import InputBlock from '../inputs/InputBlock'
import StringInput from '../inputs/StringInput'
import SelectInput from '../inputs/SelectInput'
import Modal from './Modal'

class SettingsModal extends React.Component {
  static propTypes = {
    mapStyle: React.PropTypes.object.isRequired,
    onStyleChanged: React.PropTypes.func.isRequired,
    isOpen: React.PropTypes.bool.isRequired,
    onOpenToggle: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
  }

  changeStyleProperty(property, value) {
    const changedStyle = {
      ...this.props.mapStyle,
      [property]: value
    }
    this.props.onStyleChanged(changedStyle)
  }

  changeMetadataProperty(property, value) {
    const changedStyle = {
      ...this.props.mapStyle,
      metadata: {
        ...this.props.mapStyle.metadata,
        [property]: value
      }
    }
    this.props.onStyleChanged(changedStyle)
  }

  render() {
    const metadata = this.props.mapStyle.metadata || {}
    const inputProps = { }
    return <Modal
      isOpen={this.props.isOpen}
      onOpenToggle={this.props.onOpenToggle}
      title={'Style Settings'}
    >
      <div style={{minWidth: 350}}>
      <InputBlock label={"名称"} doc={GlSpec.$root.name.doc}>
        <StringInput {...inputProps}
          value={this.props.mapStyle.name}
          onChange={this.changeStyleProperty.bind(this, "name")}
        />
      </InputBlock>
      <InputBlock label={"作者"}>
        <StringInput {...inputProps}
          value={this.props.mapStyle.owner}
          onChange={this.changeStyleProperty.bind(this, "owner")}
        />
      </InputBlock>
      <InputBlock label={"符号库"} doc={GlSpec.$root.sprite.doc}>
        <StringInput {...inputProps}
          value={this.props.mapStyle.sprite}
          onChange={this.changeStyleProperty.bind(this, "sprite")}
        />
      </InputBlock>

      <InputBlock label={"字体库"} doc={GlSpec.$root.glyphs.doc}>
        <StringInput {...inputProps}
          value={this.props.mapStyle.glyphs}
          onChange={this.changeStyleProperty.bind(this, "glyphs")}
        />
      </InputBlock>

      <InputBlock label={"Mapbox Access Token"} doc={"用于访问Mapbox的瓦片服务。"}>
        <StringInput {...inputProps}
          value={metadata['maputnik:mapbox_access_token']}
          onChange={this.changeMetadataProperty.bind(this, "maputnik:mapbox_access_token")}
        />
      </InputBlock>

      <InputBlock label={"OpenMapTiles Access Token"} doc={"用于访问OpenMapTiles的瓦片服务。"}>
        <StringInput {...inputProps}
          value={metadata['maputnik:openmaptiles_access_token']}
          onChange={this.changeMetadataProperty.bind(this, "maputnik:openmaptiles_access_token")}
        />
      </InputBlock>
      </div>
    </Modal>
  }
}

export default SettingsModal
