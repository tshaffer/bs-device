import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import './asset/bootstrap.css';
import 'normalize.css/normalize.css';
import 'flexboxgrid/dist/flexboxgrid.min.css';
import 'font-awesome/css/font-awesome.min.css';
import { App, bsBrightSignPlayerReducer, BsBrightSignPlayerState } from './index';
import { initRuntime } from './controller';
import { combineReducers } from 'redux';
import { bsDmReducer } from '@brightsign/bsdatamodel';

const getStore = () => {
  const reducers = combineReducers<BsBrightSignPlayerState>({
    bsdm: bsDmReducer,
    bsPlayer: bsBrightSignPlayerReducer,
  });
  return createStore<BsBrightSignPlayerState>(
    reducers,
    composeWithDevTools(applyMiddleware(thunk),
    ));
};

function bootstrapper() {

  console.log('bootstrapper');

  const store = getStore();

  store.dispatch(initRuntime(store));

  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root') as HTMLElement
  );

}

// setTimeout(bootstrapper, 30000);
setTimeout(bootstrapper, 1000);

