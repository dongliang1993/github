import {Button} from "antd";
import React from 'react'

class BaseCamp extends React.Component {
  render() {
    return (
        <div className="root">
          <p>{this.props.titleTips}</p>
          <Button type="primary" href={this.props.forward}>
            {this.props.forwardTips}
          </Button>
          <style jsx>{`
          .root {
            height: 400px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
        `}</style>
        </div>

    )
  }
}

export default BaseCamp
