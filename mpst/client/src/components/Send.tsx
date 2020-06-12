import React from 'react';
import S5 from '../PingPong/Client/S5';
import BenchmarkContext from '../Benchmark';

type State = {
  button: React.RefObject<HTMLButtonElement>,
};

export default class Send extends S5<State> {

  static contextType = BenchmarkContext
  declare context: React.ContextType<typeof BenchmarkContext>

  state = {
    button: React.createRef<HTMLButtonElement>(),
  }

  componentDidMount() {
    this.state.button.current?.click();
  }

  render() {
    const Ping = this.PING('onClick', () => {
      return [this.context.count]
    });

    return (
      <Ping>
        <button ref={this.state.button}>
          Ping
        </button>
      </Ping>
    );
  }
  
}