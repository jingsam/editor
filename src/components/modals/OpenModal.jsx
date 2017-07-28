import React from 'react'
import Modal from './Modal'
import Button from '../Button'
import FileReaderInput from 'react-file-reader-input'
import request from 'request'

import FileUploadIcon from 'react-icons/lib/md/file-upload'
import AddIcon from 'react-icons/lib/md/add-circle-outline'

import style from '../../libs/style.js'


class OpenModal extends React.Component {
  static propTypes = {
    mapStyle: React.PropTypes.object.isRequired,
    isOpen: React.PropTypes.bool.isRequired,
    onOpenToggle: React.PropTypes.func.isRequired,
    onStyleOpen: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  clearError() {
    this.setState({
      error: null
    })
  }

  onStyleSelect(styleUrl) {
    this.clearError();

    request({
      url: styleUrl,
      withCredentials: false,
    }, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          const mapStyle = style.ensureStyleValidity(JSON.parse(body))
          console.log('Loaded style ', mapStyle.id)
          this.props.onStyleOpen(mapStyle)
          this.onOpenToggle()
        } else {
          console.warn('Could not open the style URL', styleUrl)
        }
    })
  }

  onUploadBase(_, files) {
    const [e, file] = files[0];
    const reader = new FileReader();

    this.clearError();

    reader.readAsText(file, "UTF-8");
    reader.onload = e => {
      let mapStyle;
      try {
        mapStyle = JSON.parse(e.target.result)
      }
      catch(err) {
        this.setState({
          error: err.toString()
        });
        return;
      }
      mapStyle = style.ensureStyleValidity(mapStyle)
      mapStyle.metadata['zhixing:lastLayerId'] = mapStyle.layers[mapStyle.layers.length - 1].id

      this.props.onStyleOpen(mapStyle);
      this.onOpenToggle();
    }
    reader.onerror = e => console.log(e.target);
  }

  onUploadOverlay(_, files) {
    const [e, file] = files[0];
    const reader = new FileReader();

    this.clearError();

    reader.readAsText(file, "UTF-8");
    reader.onload = e => {
      let mapStyle;
      try {
        mapStyle = JSON.parse(e.target.result)
      }
      catch(err) {
        this.setState({
          error: err.toString()
        });
        return;
      }
      const overlayMapStyle = style.ensureStyleValidity(mapStyle)

      const baseMapStyle = this.props.mapStyle
      const lastLayerId = baseMapStyle.metadata['zhixing:lastLayerId']
        || baseMapStyle.layers[baseMapStyle.layers.length - 1].id
      baseMapStyle.metadata['zhixing:lastLayerId'] = lastLayerId
      const lastLayerIndex = baseMapStyle.layers.findIndex(layer => layer.id === lastLayerId)

      // merge overlayMapStyle into baseMapStyle
      baseMapStyle.layers.splice(lastLayerIndex + 1)
      overlayMapStyle.layers.forEach(layer => {
        // rename layer id to avoid duplicated layer
        let newLayerId = layer.id
        let i = 2
        while (baseMapStyle.layers.find(layer => layer.id === newLayerId)) {
          newLayerId += i
        }
        layer.id = newLayerId
        baseMapStyle.layers.push(layer)
      })
      baseMapStyle.center = overlayMapStyle.center
      baseMapStyle.bearing = overlayMapStyle.bearing
      baseMapStyle.pitch = overlayMapStyle.pitch

      Object.keys(overlayMapStyle.sources).forEach(sourceId => {
        if (!baseMapStyle.sources[sourceId]) baseMapStyle.sources[sourceId] = overlayMapStyle.sources[sourceId]
      })

      this.props.onStyleOpen(baseMapStyle);
      this.onOpenToggle();
    }
    reader.onerror = e => console.log(e.target);
  }

  onOpenToggle() {
    this.clearError();
    this.props.onOpenToggle();
  }

  render() {
    let errorElement;
    if(this.state.error) {
      errorElement = (
        <div className="maputnik-modal-error">
          {this.state.error}
          <a href="#" onClick={() => this.clearError()} className="maputnik-modal-error-close">×</a>
        </div>
      );
    }

    return <Modal
      isOpen={this.props.isOpen}
      onOpenToggle={() => this.onOpenToggle()}
      title={'导入样式'}
    >
      {errorElement}
      <section className="maputnik-modal-section">
        <FileReaderInput onChange={this.onUploadBase.bind(this)}>
          <Button className="maputnik-upload-button"><FileUploadIcon />导入底图样式</Button>
        </FileReaderInput>
      </section>
      <section className="maputnik-modal-section">
        <FileReaderInput onChange={this.onUploadOverlay.bind(this)}>
          <Button className="maputnik-upload-button"><FileUploadIcon />导入叠加样式</Button>
        </FileReaderInput>
      </section>
    </Modal>
  }
}

export default OpenModal
