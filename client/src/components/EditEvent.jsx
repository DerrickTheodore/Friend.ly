import React from 'react';
import Modal from 'react-modal'

class EditEvent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      eventName : null,
      nameHolder: null,
      eventDesc: null,
      capacity: null,
      startDate: null,
      endDate: null,
      imgLink: null
    }
    this.handleNameChange = this.handleNameChange.bind(this)
    this.handleDescChange = this.handleDescChange.bind(this)
    this.handleCapChange = this.handleCapChange.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      eventName: nextProps.event.eventName,
      nameHolder: nextProps.event.eventName,
      eventDesc: nextProps.event.eventDesc,
      capacity: nextProps.event.capacity,
      startDate: nextProps.event.startDate,
      endDate: nextProps.event.endDate,
      imgLink: nextProps.event.imgLink,
    })
  }

  handleNameChange(val) {
    this.setState({
      eventName: val
    })
  }

  handleDescChange(val) {
    this.setState({
      eventDesc: val
    })
  }

  handleCapChange(val) {
    this.setState({
      capacity: Number(val)
    })
  }

  render() {
    return (
      <Modal isOpen={this.props.showModal} ariaHideApp={false} style={{content: {zIndex: '10'}, overlay: {zIndex: '10', textAlign:'center', width: '50%',minWidth: '450px', margin:'auto', height: '50%'}}}>
        <div style={{height: '85%', width: '85%', margin:'auto', backgroundColor: '#eee', textAlign: 'center'}}>
          <div>Event details</div>
          <br/>
          <div>Name: <input type='text' value={this.state.eventName} onChange={(e) => {this.handleNameChange(e.target.value)}}></input></div>
          <br/>
          <div>Description: <input type='text' value={this.state.eventDesc} onChange={(e) => {this.handleDescChange(e.target.value)}}></input></div>
          <br/>
          <div>Capacity: <input type='text' value={this.state.capacity} onChange={(e) => {this.handleCapChange(e.target.value)}}></input></div>
          <button onClick={() => {this.props.handleSubmit(this.state)}}>Submit</button>
        </div>
        <button onClick={() => {this.props.handleClose()}} style={{padding: '10px', fontSize: '18px'}}>Cancel</button>
      </Modal>)
  }
}

export default EditEvent