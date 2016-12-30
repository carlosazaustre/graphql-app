import React from 'react';
import ReactDOM from 'react-dom';

const Main = React.createClass({
  render () {
    return (
      <div>
        <p>hello React!</p>
      </div>
    );
  }
});

ReactDOM.render(<Main />, document.getElementById('example'));
