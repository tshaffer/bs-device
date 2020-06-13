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
import { combineReducers } from 'redux';
import { bsDmReducer } from '@brightsign/bsdatamodel';
import { BsBspState } from './type/base';
import { bsBspReducer } from './model';
import { BrightSignPlayer } from './component';
import { initPlayer } from './controller';

const getStore = () => {
  const reducers = combineReducers<BsBspState>({
    bsdm: bsDmReducer,
    bsPlayer: bsBspReducer,
  });
  return createStore<BsBspState>(
    reducers,
    composeWithDevTools(applyMiddleware(thunk),
    ));
};

function bootstrapper() {

  console.log('bootstrapper');

  const store = getStore();

  store.dispatch(initPlayer(store));

  ReactDOM.render(
    <Provider store={store}>
      <BrightSignPlayer />
    </Provider>,
    document.getElementById('root') as HTMLElement
  );

}

// setTimeout(bootstrapper, 30000);
setTimeout(bootstrapper, 1000);
