import {Spin, Icon} from "antd";

export default () => {
  return (
      <div className="root">
        <Spin indicator={<Icon type={'loading'} style={{fontSize: 30}}/>} />
        <style jsx>
          {`
            .root {
              position: fixed;
              left: 0;
              top: 0;
              right: 0;
              bottom: 0;
              background: rgba(255, 255, 255, .3);
              z-index: 1000;
              display: flex;
              justify-content: center;
              align-items: center;
            }
          `}
        </style>
      </div>
  )
}
