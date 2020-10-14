import React, { Component } from 'react'
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const URL = 'ws://localhost:3030'

class Atis extends Component {

  state = {
    id : '',
    atisMessage: '',
    disableButton : 'true'
 
  }

  ws = new WebSocket(URL)

  async componentDidMount() {
    this.ws.onopen = () => {
      // on connecting, do nothing but log it to the console
      console.log("connection open");
      this.setState({disableButton : false});
    }

    this.ws.onmessage = evt => {
      // on receiving a message, add it to the list of messages
      const message = JSON.parse(evt.data)
      console.log("received message");
      console.log(message );
      this.addMessage(message)
    }

    this.ws.onclose = () => {
      console.log('disconnected')
      this.setState({disableButton : true});
      // automatically try to reconnect on connection loss
      this.setState({
        ws: new WebSocket(URL),
      })
    }
  }

  addMessage = message => {
    
    
    this.setState(({ id: message.id, 
                              atisMessage: message.message }))
  }  


  submitMessage = messageString => {
    // on submitting from the form.      
    console.log('submit message');
    const message = { id: this.state.id, message: messageString }
    this.ws.send(JSON.stringify(message));
  }

  render() {
    return (
      
      <div>

        <h1>ATIS Message Editor</h1>

        <form
          action="."
          onSubmit={e => {
          e.preventDefault()
          this.submitMessage(this.state.atisMessage)
        }}
        >
        <div>
        <InputTextarea value={this.state.atisMessage} onChange={(e) => this.setState({atisMessage: e.target.value})} rows={10} cols={30} />
        </div>
        
        <div>
        <Button type="submit" 
                label="Submit" 
                className={this.state.disableButton ? 'p-button-danger' : ''}  
                disabled = {this.state.disableButton}/>
        </div>




      </form>
        
      </div>
    )
  }
}

export default Atis