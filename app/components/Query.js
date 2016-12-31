import React from 'react';
import { connect } from 'react-redux';
import { getGraph } from '../actions/actions';

const Query = React.createClass({
  componentDidMount () {
    this.props.dispatch(
      getGraph(`{
        lostie(id: 2) {
          id,
          character,
          actor
        }
      }`)
    )
  },

  render () {
    let dispatch = this.props.dispatch;
    let fetchInProgress = String(this.props.store.get('fetching'));
    let queryText;
    let lostie = this.props.store.get('data').toObject();

    return (
      <div>
        <p>Fetch in Progress: {fetchInProgress}</p>
        <h3>{ lostie.character }</h3>
        <p>{ lostie.actor }</p>
        <p>{ lostie.role }</p>
        <p>{ lostie.traits }</p>
        <input ref={node => { queryText = node }} />
        <button onClick={ () => dispatch(getGraph(queryText.value)) }>Query</button>
      </div>
    );
  }
});

const mapStateToProps = (state) => {
  return {
    store: state
  };
};

const QueryContainer = connect(mapStateToProps)(Query);

export default QueryContainer;
