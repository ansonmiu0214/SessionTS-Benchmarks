import React from 'react';
import BenchmarkContext from './Benchmark';

type Props = {
  endpoint: string
};

type State = {
  ws?: WebSocket,
  button: React.RefObject<HTMLButtonElement>,
  count: number,
  ready: boolean,
  end: boolean,
}

export default class Client extends React.Component<Props, State> {

  static contextType = BenchmarkContext;
  declare context: React.ContextType<typeof BenchmarkContext>

  constructor(props: Props) {
    super(props);
    this.state = {
      ws: undefined,
      button: React.createRef(),
      count: 0,
      ready: false,
      end: false,
    }
  }

  componentDidMount() {
    const ws = new WebSocket(this.props.endpoint);

    ws.onopen = () => {
      console.time('benchmark');
      console.time(`pongping0`);
      this.setState({ ready: true, }, () => {
        this.state.button?.current?.click();
        this.setState({ ready: false, });
      });
    }

    ws.onmessage = ({ data }) => {
      const { label, payload } = JSON.parse(data);
      console.timeLog('benchmark', payload[0]);
      console.time(`pongping${payload[0]}`);
      if (label === 'PONG') {
        this.setState({ ready: true, }, () => {
          this.context.setCount(payload[0] as number, () => {
            this.state.button?.current?.click();
            this.setState({ ready: false, });
          });
        });
      } else if (label === 'BYE') {
        this.setState({ end: true, }, () => {
          this.context.setCount(payload[0] as number, () => {
            ws.close();
            console.timeEnd(`pongping${payload[0]}`);
            console.timeEnd('benchmark');
          });
        })
      } else {
        throw new Error(`Unrecognised label: ${label}`);
      }
    }

    this.setState({
      ws,
      count: this.context.count,
    });
  }

  click() {
    this.state.ws?.send(JSON.stringify({
      label: 'PING',
      payload: [this.context.count],
    }))
    console.timeEnd(`pongping${this.context.count}`);
  }

  render() {
    return (
      <div>
        <button
          ref={this.state.button}
          onClick={this.click.bind(this)}
          >
          Ping
        </button>

        {this.state.ready &&
          <p>Ready to ping</p>}

        {this.state.end &&
          <p>All pongs received</p>}
      </div>
    );
  }
}
